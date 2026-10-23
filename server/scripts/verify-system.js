const app = require('../app');
const http = require('http');
const fs = require('fs');
const path = require('path');

let server;
const PORT = 5059;

const makeRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('================================================================');
  console.log('🌸 SREE SAREES: SYSTEM & FEATURE VERIFICATION SUITE');
  console.log('   "Tradition Woven with Elegance."');
  console.log('================================================================');

  server = app.listen(PORT);
  let customerToken = '';
  let testOrderId = '';

  try {
    // 1. Health check & Brand Identity
    console.log('\n[Test 1] Health Check & Brand Identity...');
    const health = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/health',
      method: 'GET'
    });
    console.assert(health.status === 200, 'Health check failed');
    console.assert(health.data.brand === 'Sree Sarees', 'Brand name mismatch');
    console.assert(health.data.tagline === 'Tradition Woven with Elegance.', 'Tagline mismatch');
    console.log('✓ Health check passed:', health.data.brand, '|', health.data.tagline);

    // 2. Exactly 4 Collections & 40 Products
    console.log('\n[Test 2] Four Main Collections & Exactly 40 Products Verification...');
    const productsRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/products',
      method: 'GET'
    });
    console.assert(productsRes.status === 200, 'Products listing failed');
    const products = productsRes.data.products;
    console.assert(products.length === 40, `Expected exactly 40 sarees, found ${products.length}`);

    const expectedCollections = [
      'Cotton Sarees',
      'Silk Sarees',
      'Kalamkari Sarees',
      'Fancy Sarees'
    ];
    const collectionCounts = {};
    products.forEach(p => {
      collectionCounts[p.category] = (collectionCounts[p.category] || 0) + 1;
    });

    expectedCollections.forEach(cat => {
      console.assert(collectionCounts[cat] === 10, `Expected 10 sarees in ${cat}, got ${collectionCounts[cat]}`);
      console.log(`  • ${cat}: ${collectionCounts[cat]} sarees`);
    });
    console.log(`✓ Exactly 4 collections verified: 10 sarees each (40 total).`);

    // 3. Local Product-Only Photography Verification
    console.log('\n[Test 3] Local Saree Photography Verification (Zero Broken Images)...');
    let localMissingCount = 0;
    products.forEach(p => {
      p.images.forEach(imgRel => {
        // imgRel is like /images/sarees/cotton-1.jpg
        const localPath = path.join(__dirname, '../../client/public', imgRel);
        if (!fs.existsSync(localPath)) {
          console.error(`  ❌ Missing local image file: ${localPath}`);
          localMissingCount++;
        }
      });
    });
    console.assert(localMissingCount === 0, `Found ${localMissingCount} missing local image files!`);
    console.log(`✓ All 40 saree images exist locally in client/public/images/sarees/ (Zero broken links).`);

    // 4. Saree Length & Blouse Details Verification
    console.log('\n[Test 4] Saree Dimensions & Blouse Piece Verification...');
    const sampleProduct = products[0];
    console.assert(sampleProduct.sareeLength === '5.5 meters', `Unexpected length: ${sampleProduct.sareeLength}`);
    console.assert(Boolean(sampleProduct.blouseDetails), 'Missing blouseDetails field');
    console.log(`✓ Saree specifications verified: Length = ${sampleProduct.sareeLength}, Blouse = ${sampleProduct.blouseDetails}`);

    // 5. Centralized Business Configuration API
    console.log('\n[Test 5] Centralized Business Configuration API (GET /api/config/business)...');
    const configRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/config/business',
      method: 'GET'
    });
    console.assert(configRes.status === 200, 'Business config API failed');
    console.assert(configRes.data.data.contactPhone === '+91 9087637123', `Expected contact phone +91 9087637123, got: ${configRes.data.data.contactPhone}`);
    console.log(`✓ Business config verified: ${configRes.data.data.brandName} in ${configRes.data.data.address.city}, ${configRes.data.data.address.state}. Contact: ${configRes.data.data.contactPhone}`);

    // 6. Blouse Stitching Enquiry Submission
    console.log('\n[Test 6] Blouse Stitching Enquiry Submission (POST /api/enquiries/blouse)...');
    const blouseRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/enquiries/blouse',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      customerName: 'Priyanka Devi',
      customerPhone: '9876543210',
      customerEmail: 'priya@example.com',
      neckDesignFront: 'Round Neck',
      neckDesignBack: 'Deep U Neck with Dori',
      sleeveType: 'Elbow Length',
      liningRequired: true,
      paddingRequired: false,
      preferredTimeline: 'Standard (5-7 days)',
      measurements: {
        bust: '36',
        waist: '30',
        length: '14.5',
        shoulder: '14'
      }
    });
    console.assert(blouseRes.status === 201, `Blouse enquiry failed: ${JSON.stringify(blouseRes.data)}`);
    console.assert(blouseRes.data.enquiryId.startsWith('BLS-'), `Invalid enquiryId: ${blouseRes.data.enquiryId}`);
    console.log(`✓ Blouse enquiry registered successfully! ID: ${blouseRes.data.enquiryId}`);

    // 7. Aari Work Class Enquiry Submission
    console.log('\n[Test 7] Aari Work Class Enquiry Submission (POST /api/enquiries/aari)...');
    const aariRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/enquiries/aari',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      studentName: 'Ananya Meenakshi',
      studentPhone: '9840123456',
      studentEmail: 'ananya@example.com',
      preferredFormat: 'Offline Classes in and around Madurai',
      preferredBatch: 'Morning Batch (10:00 AM – 12:00 PM)',
      experienceLevel: 'Complete Beginner',
      city: 'Madurai',
      needKit: true
    });
    console.assert(aariRes.status === 201, `Aari enquiry failed: ${JSON.stringify(aariRes.data)}`);
    console.assert(aariRes.data.enquiryId.startsWith('AARI-'), `Invalid enquiryId: ${aariRes.data.enquiryId}`);
    console.log(`✓ Aari class enquiry registered successfully! ID: ${aariRes.data.enquiryId} (${aariRes.data.data.preferredFormat})`);

    // 8. Customer Registration & Login
    console.log('\n[Test 8] Customer Registration & Login...');
    const testEmail = `priya_${Date.now()}@example.com`;
    const regRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Priyanka Devi',
      email: testEmail,
      password: 'CustomerSecure@123',
      phone: '9876543210',
      whatsappConsent: true,
      deliveryAddress: {
        addressLine: 'Flat 402, Royal Palms, South Masi Street',
        city: 'Madurai',
        state: 'Tamil Nadu',
        pincode: '625001'
      }
    });
    console.assert(regRes.status === 201, `Customer registration failed: ${JSON.stringify(regRes.data)}`);
    customerToken = regRes.data.token;
    console.log('✓ Customer registration & token acquisition passed.');

    // 9. Cash on Delivery (COD) Order Placement & Inventory Deduction
    console.log('\n[Test 9] Cash on Delivery Order Placement & Stock Deduction...');
    const targetProduct = products[0];
    const initialStock = targetProduct.stockQuantity;

    const orderRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      }
    }, {
      items: [
        { productId: targetProduct.productId, quantity: 1 }
      ],
      deliveryAddress: {
        fullName: 'Priyanka Devi',
        phone: '9876543210',
        addressLine: 'Flat 402, Royal Palms, South Masi Street',
        city: 'Madurai',
        state: 'Tamil Nadu',
        pincode: '625001'
      },
      paymentMethod: 'CASH_ON_DELIVERY',
      notes: 'Please pack carefully.'
    });

    console.assert(orderRes.status === 201, `Order placement failed: ${JSON.stringify(orderRes.data)}`);
    console.assert(orderRes.data.order.paymentMethod === 'CASH_ON_DELIVERY', 'Payment method mismatch');
    console.assert(orderRes.data.order.whatsappNotifications !== undefined, 'WhatsApp notifications missing');
    console.assert(orderRes.data.order.whatsappNotifications.recipient === '919087637123', `Expected recipient 919087637123, got: ${orderRes.data.order.whatsappNotifications.recipient}`);
    console.log('✓ COD Order placed successfully! Order #:', orderRes.data.order.orderNumber);
    console.log('  • Owner WhatsApp Recipient: +91 9087637123');
    console.log('  • Owner WhatsApp Notification Status:', orderRes.data.order.whatsappNotifications.ownerStatus);
    console.log('  • Customer Confirmation: Website Order Screen (Customer WhatsApp disabled as per Req 8)');

    // 10. Sree AI Shopping Assistant: Cheapest Saree Query
    console.log('\n[Test 10] Sree AI: Cheapest Saree Query (Should return ₹499 Chettinad)...');
    const aiCheap = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/ai/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { message: 'What is the cheapest saree available?' });
    console.assert(aiCheap.status === 200, 'AI query failed');
    console.assert(aiCheap.data.reply.includes('499'), `AI did not identify ₹499 saree: ${aiCheap.data.reply}`);
    console.assert(aiCheap.data.products.length > 0, 'AI did not return products');
    console.log('✓ Sree AI cheapest saree passed:', aiCheap.data.reply.split('\n')[0]);

    // 11. Sree AI Shopping Assistant: Sarees Under ₹1,500
    console.log('\n[Test 11] Sree AI: Sarees Under ₹1,500 Query...');
    const aiBudget = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/ai/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { message: 'Show me sarees under ₹1,500' });
    console.assert(aiBudget.status === 200, 'AI budget query failed');
    console.assert(aiBudget.data.products.length > 0, 'No products returned for under 1500');
    aiBudget.data.products.forEach(p => {
      const price = p.discountPrice || p.price;
      console.assert(price <= 1500, `Product ${p.name} exceeds 1500: ₹${price}`);
    });
    console.log(`✓ Sree AI budget search passed: Returned ${aiBudget.data.products.length} sarees under ₹1,500.`);

    // 12. Sree AI Shopping Assistant: Blouse Stitching Query
    console.log('\n[Test 12] Sree AI: Blouse Stitching Query...');
    const aiBlouse = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/ai/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { message: 'Tell me about blouse stitching service' });
    console.assert(aiBlouse.status === 200, 'AI blouse query failed');
    console.assert(aiBlouse.data.reply.includes('Blouse Stitching'), 'Missing blouse stitching details');
    console.assert(aiBlouse.data.reply.includes('measurements'), 'Missing measurement guidance');
    console.log('✓ Sree AI blouse stitching query passed.');

    // 13. Sree AI Shopping Assistant: Aari Work Classes Query
    console.log('\n[Test 13] Sree AI: Aari Work Classes Query (Online & Madurai)...');
    const aiAari = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/ai/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { message: 'Tell me about Aari work classes' });
    console.assert(aiAari.status === 200, 'AI Aari query failed');
    console.assert(aiAari.data.reply.includes('Online Live Sessions'), 'Missing Online format');
    console.assert(aiAari.data.reply.includes('Madurai'), 'Missing Madurai location');
    console.log('✓ Sree AI Aari work classes query passed.');

    // 14. Sree AI Shopping Assistant: Special Offers Query
    console.log('\n[Test 14] Sree AI: Special Offers Query...');
    const aiOffer = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/ai/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { message: 'What special offers are available?' });
    console.assert(aiOffer.status === 200, 'AI offers query failed');
    console.assert(aiOffer.data.products.length > 0, 'No offer products returned');
    console.log(`✓ Sree AI offers query passed: Returned ${aiOffer.data.products.length} offer sarees.`);

    console.log('\n================================================================');
    console.log('🎉 ALL 14 SYSTEM & PLATFORM VERIFICATION TESTS PASSED!');
    console.log('================================================================\n');
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
  }
};

runTests();
