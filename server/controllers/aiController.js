const storeAdapter = require('../config/storeAdapter');
const Product = require('../models/Product');
const { isMongoConnected } = require('../config/db');
const businessConfig = require('../config/businessConfig');

// @desc    Process customer query via Sree AI Shopping Assistant
// @route   POST /api/ai/chat
// @access  Public
const handleAIChat = async (req, res, next) => {
  try {
    const { message, history = [], context = {} } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message for Sree AI.'
      });
    }

    const userQuery = message.trim();

    // 1. Fetch live active catalogue from database or persistent store
    let allProducts = [];
    if (isMongoConnected()) {
      allProducts = await Product.find({ isActive: true });
    } else {
      allProducts = storeAdapter.getProducts({ isActive: true });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    // Check if live Gemini API is configured
    if (geminiKey && geminiKey.trim() && !geminiKey.includes('placeholder')) {
      try {
        const geminiResult = await callGeminiLLM(geminiKey, userQuery, history, allProducts, context);
        if (geminiResult) {
          return res.json({
            success: true,
            reply: geminiResult.reply,
            products: geminiResult.products,
            mode: 'gemini',
            provider: 'Google Gemini'
          });
        }
      } catch (geminiErr) {
        console.warn('[Sree AI] Gemini API call error, falling back to Intelligent Catalogue Search:', geminiErr.message);
      }
    }

    // 2. Intelligent Natural Language Processing & Saree Shopping Engine
    const result = processCatalogueQuery(userQuery, history, allProducts, context);

    res.json({
      success: true,
      reply: result.reply,
      products: result.products,
      mode: 'catalogue',
      setupNotice: geminiKey
        ? 'Gemini API call timed out. Fallback catalogue query engine responded.'
        : 'Sree AI is operating in Connected Catalogue Mode. Set GEMINI_API_KEY in server/.env for multi-turn generative LLM reasoning.'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Intelligent Natural Language Query Processor for Sree Sarees Catalogue & Shopping Guidance
 */
function processCatalogueQuery(query, history = [], products = [], context = {}) {
  const q = query.toLowerCase().trim();

  // ==========================================
  // 1. BLOUSE STITCHING SERVICE INQUIRY
  // ==========================================
  if (/blouse|stitching|tailor|tailoring|custom\s*stitch|measurement/i.test(q)) {
    return {
      reply: "✨ **Sree Sarees Bespoke Blouse Stitching Service**\n\n" +
        "We offer personalized, custom blouse tailoring crafted to your exact fit!\n\n" +
        "• **How It Works:** Choose your preferred neckline (Round, Boat, V-Neck, Sweetheart, Deep-U, High-Neck), sleeve style (Cap, Elbow, Full, Sleeveless), and enter your measurements in inches.\n" +
        "• **Customization Options:** Premium cotton/butter-crepe lining, padded cups, piping, dori tassels, and traditional hook closures.\n" +
        "• **Quotation Policy:** Every custom blouse is handcrafted by our master tailors. Once you submit your measurements and design preferences via our **Blouse Stitching page (/blouse-stitching)**, our master tailor reviews the specifications and connects directly with you via phone/WhatsApp to confirm personalized pricing and timeline.\n" +
        "• **Delivery Timeline:** Standard stitching takes 5–7 working days, and express 3–4 days.",
      products: []
    };
  }

  // ==========================================
  // 2. AARI WORK CLASSES INQUIRY
  // ==========================================
  if (/aari|embroidery\s*class|maggam\s*work|aari\s*work|stitching\s*class|learn\s*aari/i.test(q)) {
    return {
      reply: "🧵 **Sree Sarees Authentic Aari Work Classes**\n\n" +
        "Master the traditional art of Aari and Maggam embroidery through hands-on guidance!\n\n" +
        "We offer **Two Comprehensive Learning Formats**:\n" +
        "1. **Online Live Sessions:** Interactive live video batches with close-up stitch demonstrations, weekly assignments, and real-time doubt-clearing from the comfort of your home.\n" +
        "2. **Offline Classes in and around Madurai, Tamil Nadu:** Intimate classroom batches at our Madurai boutique with physical wooden frame setup, hands-on posture guidance, and personalized attention.\n\n" +
        "• **Curriculum:** Basic chain stitch, water filling, mirror work, zardozi, French knots, cutwork, and complete bridal blouse layout.\n" +
        "• **Starter Kit:** An authentic wooden ring frame, Aari needle set, silk zari threads, pearl beads, and fabric swatch are provided.\n" +
        "• **Batch Timings & Fees:** Visit our **Aari Work Class page (/aari-work-class)** to submit your preferred format and timing. Our coordinator will contact you directly with batch openings and enrollment fees.",
      products: []
    };
  }

  // ==========================================
  // 3. DEDICATED OFFERS / DISCOUNTS INQUIRY
  // ==========================================
  if (/offer|offers|discount|sale|deals?|save|promotion/i.test(q)) {
    const offerSarees = products.filter(p => p.isOffer || (p.discountPrice && p.discountPrice < p.price));
    return {
      reply: "🎉 **Sree Sarees Special Offers**\n\n" +
        "We have genuine discounts of up to 25% off across our 4 collections!\n" +
        "Visit our dedicated **Offers Page (/offers)** to browse all specially priced sarees with verified savings. Here are some of our top festive offers available right now:",
      products: offerSarees.slice(0, 4)
    };
  }

  // ==========================================
  // 4. CHEAPEST SAREE / LOWEST PRICE INQUIRY
  // ==========================================
  const isCheapestQuery = /cheapest|lowest\s*price|most\s*affordable|least\s*expensive|low\s*cost|cheaper|starts?\s*from/i.test(q);
  if (isCheapestQuery) {
    const sorted = [...products].sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      return priceA - priceB;
    });

    const cheapest = sorted[0];
    if (cheapest) {
      const cheapPrice = cheapest.discountPrice || cheapest.price;
      const hasDiscount = cheapest.discountPrice && cheapest.discountPrice < cheapest.price;
      return {
        reply: `Our most affordable saree is the **${cheapest.name}** priced at just **₹${cheapPrice.toLocaleString('en-IN')}**${hasDiscount ? ` (discounted from ₹${cheapest.price.toLocaleString('en-IN')})` : ''}!\n\n` +
          `Belonging to our **${cheapest.category}** collection, it is crafted from pure breathable ${cheapest.fabric} with a 5.5m length and 0.8m blouse piece. Here are our top budget-friendly sarees:`,
        products: sorted.slice(0, 4)
      };
    }
  }

  // ==========================================
  // 5. FOUR MAIN COLLECTIONS EXPLICIT GUIDANCE
  // ==========================================
  if (/cotton\s*sarees?|daily\s*wear|mulmul|chettinad|mangalagiri|casual\s*cotton/i.test(q)) {
    const cottons = products.filter(p => p.category === 'Cotton Sarees');
    return {
      reply: "🌿 **Cotton Sarees Collection** — Breathable Handloom Comfort\n\n" +
        "Handwoven pure Mangalagiri, Mulmul, Chettinad, and Chanderi cotton sarees designed for everyday grace, workwear, and summer elegance (5.5m + 0.8m blouse piece). Here are our popular cotton sarees:",
      products: cottons.slice(0, 4)
    };
  }

  if (/silk\s*sarees?|kanjivaram|soft\s*silk|art\s*silk|mysore\s*silk|wedding\s*silk/i.test(q)) {
    const silks = products.filter(p => p.category === 'Silk Sarees');
    return {
      reply: "👑 **Silk Sarees Collection** — Timeless Weaves of Grandeur\n\n" +
        "Lustrous Kanjivaram style soft silks, pure art silks, and Mysore weaves featuring rich gold zari borders and opulent brocade pallus. Perfect for weddings, festivals, and grand occasions:",
      products: silks.slice(0, 4)
    };
  }

  if (/kalamkari\s*sarees?|kalamkari|pen\s*kalamkari|temple\s*motif|mythological/i.test(q)) {
    const kalamkaris = products.filter(p => p.category === 'Kalamkari Sarees');
    return {
      reply: "🎨 **Kalamkari Sarees Collection** — Artisanal Heritage Motifs\n\n" +
        "Authentic pen and block-printed Kalamkari sarees depicting timeless peacock, temple, and floral vine artwork on natural handloom fabrics:",
      products: kalamkaris.slice(0, 4)
    };
  }

  if (/fancy\s*sarees?|fancy|organza|georgette|chiffon|contemporary|party|shimmer|bandhej|bandhani|brocade/i.test(q)) {
    const fancies = products.filter(p => p.category === 'Fancy Sarees');
    return {
      reply: "✨ **Fancy Sarees Collection** — Contemporary Shimmer & Grace\n\n" +
        "Modern designer organza, shimmering tissue weaves, traditional bandhani, and georgette party-wear sarees with intricate embroidery borders (5.5m + 0.8m blouse piece included). Perfect for receptions and celebrations:",
      products: fancies.slice(0, 4)
    };
  }

  // ==========================================
  // 6. FABRIC CARE INSTRUCTIONS
  // ==========================================
  const isCareQuery = /care|wash|washing|clean|dry\s*clean|iron|storing|preserve|maintain/i.test(q);
  if (isCareQuery) {
    return {
      reply: "🌸 **Sree Sarees Care & Preservation Guide**:\n\n" +
        "1. **Dry Cleaning:** Pure silk and rich zari weaves should strictly be dry cleaned.\n" +
        "2. **Cotton Handlooms:** Wash gently in cold water with mild liquid detergent. Dry in the shade to protect vibrant dye colors.\n" +
        "3. **Storage:** Wrap your sarees in soft, breathable unbleached muslin or cotton cloth. Avoid airtight plastic bags.\n" +
        "4. **Gold Zari Care:** Never spray perfumes, body mists, or hairsprays directly onto gold zari borders to prevent oxidation and tarnish.\n" +
        "5. **Refolding:** Unfold and refold along different crease lines every 3 to 4 months.",
      products: []
    };
  }

  // ==========================================
  // 7. SPECIFIC SAREE INQUIRY (Price, Fabric, Availability)
  // ==========================================
  let referencedProduct = null;
  if (context && context.currentProduct) {
    referencedProduct = context.currentProduct;
  } else if (context && context.productId) {
    referencedProduct = products.find(p => p.productId === context.productId || p._id === context.productId);
  }

  if (!referencedProduct) {
    referencedProduct = products.find(p => q.includes(p.name.toLowerCase()) || (p.productId && q.includes(p.productId.toLowerCase())));
  }

  if (!referencedProduct && history.length > 0) {
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].products && history[i].products.length > 0) {
        referencedProduct = history[i].products[0];
        break;
      }
    }
  }

  // Price inquiry for specific saree
  const isSpecificPriceInquiry = /price|cost|how\s*much|rate/i.test(q) && (/(this|the|that)\s*saree/i.test(q) || Boolean(referencedProduct && !/under|below|less/i.test(q)));
  if (isSpecificPriceInquiry && referencedProduct) {
    const dispPrice = referencedProduct.discountPrice || referencedProduct.price;
    const hasDisc = referencedProduct.discountPrice && referencedProduct.discountPrice < referencedProduct.price;
    return {
      reply: `The price of **${referencedProduct.name}** is **₹${dispPrice.toLocaleString('en-IN')}**${hasDisc ? ` (special offer, discounted from ₹${referencedProduct.price.toLocaleString('en-IN')})` : ''}. Length: ${referencedProduct.sareeLength || '5.5 meters'}, Blouse: ${referencedProduct.blouseDetails || '0.8 meter unstitched'}.`,
      products: [referencedProduct]
    };
  }

  // Availability inquiry for specific saree
  const isSpecificAvailInquiry = /available|availability|in\s*stock|out\s*of\s*stock/i.test(q) && (/(this|the|that)\s*saree/i.test(q) || Boolean(referencedProduct));
  if (isSpecificAvailInquiry && referencedProduct) {
    const isAvail = referencedProduct.stockQuantity > 0;
    return {
      reply: isAvail
        ? `Yes! **${referencedProduct.name}** is currently **Available and In Stock** with **${referencedProduct.stockQuantity} piece${referencedProduct.stockQuantity > 1 ? 's' : ''}** ready in our boutique.`
        : `Currently, **${referencedProduct.name}** is **Temporarily Sold Out**. Our master weavers will restock fresh weaves shortly.`,
      products: [referencedProduct]
    };
  }

  // ==========================================
  // 8. GENERAL PRICE BOUND & FILTERING
  // ==========================================
  let maxPriceFilter = null;
  const priceMatch = q.match(/(?:under|below|less\s+than|within|upto|budget(?:\s+of)?)\s*(?:₹|rs\.?|inr)?\s*(\d+[\d,]*)/i);
  if (priceMatch) {
    maxPriceFilter = parseInt(priceMatch[1].replace(/,/g, ''), 10);
  }

  // Color Matching
  const colorMap = {
    'green': ['green', 'emerald', 'mint', 'olive'],
    'red': ['red', 'crimson', 'maroon', 'vermilion'],
    'blue': ['blue', 'indigo', 'peacock blue', 'navy', 'sapphire'],
    'pink': ['pink', 'rani pink', 'rose', 'magenta'],
    'yellow': ['yellow', 'mustard', 'gold', 'haldi'],
    'orange': ['orange', 'marigold', 'rust'],
    'purple': ['purple', 'violet', 'lavender', 'plum', 'wine'],
    'black': ['black'],
    'white': ['white', 'off-white', 'cream', 'ivory']
  };

  let matchedColors = [];
  for (const [key, aliases] of Object.entries(colorMap)) {
    if (aliases.some(alias => q.includes(alias))) {
      matchedColors.push(key);
    }
  }

  // Category Matching strictly limited to 4 collections
  let matchedCategory = null;
  if (/cotton/i.test(q)) matchedCategory = 'Cotton Sarees';
  else if (/silk/i.test(q)) matchedCategory = 'Silk Sarees';
  else if (/kalamkari/i.test(q)) matchedCategory = 'Kalamkari Sarees';
  else if (/fancy|organza|georgette|bandhej|bandhani/i.test(q)) matchedCategory = 'Fancy Sarees';

  let matchedProducts = products.filter(p => {
    const effectivePrice = p.discountPrice || p.price;
    if (maxPriceFilter !== null && effectivePrice > maxPriceFilter) return false;
    if (matchedCategory && p.category !== matchedCategory) return false;
    if (matchedColors.length > 0) {
      const pColor = p.colour.toLowerCase();
      const pName = p.name.toLowerCase();
      const matchesColor = matchedColors.some(c =>
        pColor.includes(c) || pName.includes(c) || (colorMap[c] && colorMap[c].some(a => pColor.includes(a) || pName.includes(a)))
      );
      if (!matchesColor) return false;
    }
    return true;
  });

  if (matchedProducts.length > 0) {
    let replyText = `Here are our matching sarees from our boutique collection:`;
    if (maxPriceFilter && matchedCategory) {
      replyText = `Here are our **${matchedCategory}** priced under ₹${maxPriceFilter.toLocaleString('en-IN')}:`;
    } else if (maxPriceFilter) {
      replyText = `Here are sarees priced under ₹${maxPriceFilter.toLocaleString('en-IN')}:`;
    } else if (matchedColors.length > 0 && matchedCategory) {
      replyText = `Here are our **${matchedColors.join('/')} ${matchedCategory}**:`;
    } else if (matchedCategory) {
      replyText = `Here are curated sarees from our **${matchedCategory}** collection:`;
    }

    return {
      reply: replyText,
      products: matchedProducts.slice(0, 4)
    };
  }

  // Fallback
  return {
    reply: `Welcome to **Sree Sarees** — "Tradition Woven with Elegance."\n\n` +
      `You can browse our **4 Main Collections**: Cotton Sarees, Silk Sarees, Kalamkari Sarees, and Fancy Sarees.\n` +
      `We also offer a dedicated **Offers Section**, bespoke **Blouse Stitching**, and **Aari Work Classes** (Online Live & Offline in Madurai)!\n\n` +
      `Feel free to ask me:\n` +
      `• "Show me green Banarasi or Silk sarees"\n` +
      `• "Show sarees under ₹1,500"\n` +
      `• "What is the cheapest saree?"\n` +
      `• "Tell me about blouse stitching"\n` +
      `• "Tell me about Aari work classes"`,
    products: products.slice(0, 4)
  };
}

/**
 * Call Google Gemini LLM API when GEMINI_API_KEY is supplied
 */
async function callGeminiLLM(apiKey, query, history, products) {
  const catalogueSummary = products.map(p => ({
    id: p.productId,
    name: p.name,
    price: p.discountPrice || p.price,
    fabric: p.fabric,
    colour: p.colour,
    category: p.category,
    sareeLength: p.sareeLength || '5.5 meters',
    blouseDetails: p.blouseDetails || '0.8 meter unstitched',
    isOffer: !!p.isOffer,
    inStock: p.stockQuantity > 0,
    units: p.stockQuantity
  }));

  const systemInstruction = `You are "Sree AI — Your Saree Shopping Assistant", the warm, cultured shopping assistant for Sree Sarees (Tagline: "Tradition Woven with Elegance.").
Location: South Masi Street, Madurai, Tamil Nadu.

Store Catalogue (Strictly 4 Collections: Cotton Sarees, Silk Sarees, Kalamkari Sarees, Fancy Sarees):
${JSON.stringify(catalogueSummary, null, 2)}

Key Store Features:
1. Four Collections: Cotton Sarees, Silk Sarees, Kalamkari Sarees, Fancy Sarees.
2. Offers Section: Handpicked discounted sarees with genuine discount badges.
3. Blouse Stitching Service: Tailored to customer measurements in inches. Customers submit preferences on the Blouse Stitching page, and our master tailor reaches out with personalized quotation. No fake fixed pricing.
4. Aari Work Classes: Two formats available - Online Live Sessions & Offline Classes in and around Madurai, Tamil Nadu. Complete hands-on training with materials kit.
5. Saree Dimensions: Standard 5.5 meters saree length + 0.8 meter unstitched blouse piece.
6. Payments: Cash on Delivery (COD) and Online Payments.
7. WhatsApp Order Notifications: Instant updates to shop owner and customer via WhatsApp Business API.

Instructions:
1. Always base product answers strictly on this catalogue. Never invent products.
2. If products match, append at the end: [MATCHED_PRODUCT_IDS: SS-XXX-001, SS-XXX-002]
3. Keep tone respectful, concise, and elegant.`;

  const messages = [
    {
      role: 'user',
      parts: [{ text: systemInstruction + `\n\nCustomer question: ${query}` }]
    }
  ];

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: messages })
  });

  if (!response.ok) {
    throw new Error(`Gemini HTTP ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const rawReply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  const idMatch = rawReply.match(/\[MATCHED_PRODUCT_IDS:\s*([^\]]+)\]/);
  let matchedIds = [];
  let cleanReply = rawReply;

  if (idMatch) {
    matchedIds = idMatch[1].split(',').map(s => s.trim());
    cleanReply = rawReply.replace(/\[MATCHED_PRODUCT_IDS:\s*[^\]]+\]/, '').trim();
  }

  const matchingProducts = products.filter(p => matchedIds.includes(p.productId));

  return {
    reply: cleanReply,
    products: matchingProducts
  };
}

module.exports = {
  handleAIChat
};
