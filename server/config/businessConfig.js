// Centralized Business Configuration for Sree Sarees
// Tagline: "Tradition Woven with Elegance."
// Contains verified business information, service policies, and development placeholders.

const BUSINESS_CONFIG = {
  brandName: 'Sree Sarees',
  tagline: 'Tradition Woven with Elegance.',
  
  // ==========================================
  // CONTACT & SOCIAL INFORMATION
  // ==========================================
  // NOTE FOR STORE OWNER:
  // '+91 90000 00000' is a sample development placeholder number.
  // Before publishing to live customers, replace this with your verified business phone number.
  // Do NOT send real calls or WhatsApp messages to this sample placeholder.
  contactPhone: process.env.OWNER_PHONE || '+91 9087637123',
  contactWhatsApp: process.env.WHATSAPP_OWNER_PHONE || '+91 9087637123',
  ownerWhatsApp: process.env.WHATSAPP_OWNER_PHONE || '+91 9087637123',
  isSampleContactNumber: false,
  contactEmail: 'contact@sreesarees.com',
  
  // Physical Boutique & Training Center Location
  address: {
    street: 'Handloom Heritage Enclave, South Masi Street',
    city: 'Madurai',
    state: 'Tamil Nadu',
    pincode: '625001',
    country: 'India',
    landmark: 'Near Meenakshi Amman Temple Heritage Zone'
  },
  
  operatingHours: {
    weekdays: '9:30 AM – 8:30 PM IST',
    saturday: '9:30 AM – 8:30 PM IST',
    sunday: '10:00 AM – 2:00 PM IST (By Prior Appointment)'
  },

  // ==========================================
  // FOUR MAIN SAREE COLLECTIONS
  // ==========================================
  collections: [
    {
      id: 'cotton-sarees',
      name: 'Cotton Sarees',
      tagline: 'Breathable Handloom Comfort',
      description: 'Handwoven pure Mangalagiri, Mulmul, Chettinad, and Chanderi cotton sarees for everyday grace and comfort.'
    },
    {
      id: 'silk-sarees',
      name: 'Silk Sarees',
      tagline: 'Timeless Weaves of Grandeur',
      description: 'Lustrous Kanjivaram style soft silks, pure art silks, and Mysore weaves featuring authentic gold zari borders.'
    },
    {
      id: 'kalamkari-sarees',
      name: 'Kalamkari Sarees',
      tagline: 'Artisanal Heritage Motifs',
      description: 'Authentic pen and block-printed Kalamkari sarees depicting timeless peacock, temple, and floral vine artwork on natural fabrics.'
    },
    {
      id: 'fancy-sarees',
      name: 'Fancy Sarees',
      tagline: 'Contemporary Shimmer & Grace',
      description: 'Modern designer organza, shimmering georgette, and evening party-wear weaves with delicate embroidery.'
    }
  ],

  // ==========================================
  // BLOUSE STITCHING SERVICE POLICIES
  // ==========================================
  blouseStitching: {
    serviceName: 'Custom Designer Blouse Stitching',
    serviceDescription: 'Bespoke tailoring crafted to your exact measurements, neckline preferences, and handcrafted Aari work embroidery.',
    quotationNotice: 'Stitching charges depend on your selected design, material, and work requirements. Please submit your details and contact the owner for a quotation.',
    turnaroundTime: 'Typically 5 to 7 business days following quotation agreement and material handover.',
    standardSizes: ['32', '34', '36', '38', '40', '42', '44', 'Custom (Tailor Fitted)'],
    measurementFields: [
      { key: 'bust', label: 'Bust Size', unit: 'Inches', required: true },
      { key: 'underBust', label: 'Under-Bust', unit: 'Inches', required: false },
      { key: 'shoulder', label: 'Shoulder Width', unit: 'Inches', required: true },
      { key: 'blouseLength', label: 'Blouse Length', unit: 'Inches', required: true },
      { key: 'sleeveLength', label: 'Sleeve Length', unit: 'Inches', required: true },
      { key: 'armhole', label: 'Armhole Circumference', unit: 'Inches', required: false },
      { key: 'frontNeckDepth', label: 'Front Neck Depth', unit: 'Inches', required: true },
      { key: 'backNeckDepth', label: 'Back Neck Depth', unit: 'Inches', required: true },
      { key: 'waist', label: 'Waist / Bottom Hem', unit: 'Inches', required: false }
    ],
    supportedPatterns: [
      'Princess Cut (Contemporary & Form-Fitting)',
      'Katori Cut (Traditional Cup Style)',
      'Regular 4-Dart Classical Cut',
      'High Neck / Collar Style',
      'Boat Neck Drape Style',
      'Back Open with Dori & Tassels',
      'Front Open Hook Style'
    ],
    supportedNecklines: [
      'Sweetheart Neckline',
      'Classic Deep Round Neck',
      'Royal V-Neckline',
      'Square Cut Neck',
      'Pot Neck with Dori',
      'Keyhole Teardrop Back',
      'Sheer Net Embroidered Back'
    ],
    supportedSleeves: [
      'Elbow Length with Heavy Border (Bridal Favorite)',
      'Cap Sleeves',
      'Classic Short Sleeves',
      'Sleeveless with Soft Piping',
      'Full Length Sheer Sleeves'
    ]
  },

  // ==========================================
  // AARI WORK CLASS POLICIES & FORMATS
  // ==========================================
  aariWorkClass: {
    className: 'Aari Work Class',
    tagline: 'Master the Royal Heritage Art of Aari & Zardozi Embroidery',
    inquiryNotice: 'Interested in learning Aari Work? We offer online live sessions and offline classes in and around Madurai. Contact the owner to enquire about class details, available batches, fees, and payment arrangements.',
    formats: [
      {
        type: 'ONLINE_LIVE',
        title: 'Online Live Interactive Sessions',
        description: 'Conducted live via interactive video conferencing with step-by-step needle demonstrations and direct instructor feedback. Not pre-recorded.',
        scheduleNote: 'Morning and evening batches available. Class schedule and joining links are shared upon registration with the owner.',
        materialsProvided: 'Complete student kit list provided (Aari needle, embroidery ring frame, silk threads, zardozi wires, beads, sequins, and marking pencil).'
      },
      {
        type: 'OFFLINE_MADURAI',
        title: 'Offline In-Person Classes in Madurai',
        description: 'Hands-on classroom training conducted in and around Madurai, Tamil Nadu with personalized 1-on-1 practical embroidery coaching.',
        locationNote: 'Conducted in Madurai, Tamil Nadu. Exact center location and available batch timings are confirmed directly by the owner upon enquiry.',
        practicalSessions: 'Live practice on cot frames, fabric mounting, tracing designs onto blouse necklines, and mastering intricate bridal borders.'
      }
    ],
    syllabus: [
      'Module 1: Introduction to Aari needle grip, fabric fixing on ring/cot frame, and foundation chain stitch.',
      'Module 2: Water stitch, reverse stitch, double chain stitch, and zigzag filling techniques.',
      'Module 3: Beadwork, sugar bead embroidery, sequence loading, and stone chain fixing.',
      'Module 4: Zardozi spiral work, spring wire loading, and embossed French knot embroidery.',
      'Module 5: Mirror work, cut work, and peacock & floral motif filling.',
      'Module 6: Bridal blouse neck tracing, carbon marking, symmetrical sleeve borders, and professional finishing.'
    ],
    faqs: [
      {
        q: 'Are online classes live or recorded?',
        a: 'All online classes are conducted through live, interactive sessions so students can ask questions and have their needlework inspected in real time.'
      },
      {
        q: 'Where are the offline classes held?',
        a: 'Offline classes are conducted in and around Madurai, Tamil Nadu. The exact batch location and timing are confirmed directly by the owner based on your preferred area.'
      },
      {
        q: 'How much are the class fees?',
        a: 'Class fees and payment arrangements are discussed directly with the owner depending on your chosen format (Online Live or Offline in Madurai) and batch.'
      },
      {
        q: 'Do I need prior stitching experience?',
        a: 'No prior embroidery experience is required! We start from basic thread handling and advance step-by-step to bridal blouse work.'
      }
    ]
  }
};

module.exports = BUSINESS_CONFIG;
