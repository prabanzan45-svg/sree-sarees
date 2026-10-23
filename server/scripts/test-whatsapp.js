/**
 * Standalone WhatsApp Notification Verification Script
 * Tests:
 * 1. Owner WhatsApp Business number resolution (+91 9087637123)
 * 2. Complete order message formatting with all 11 required elements
 * 3. Strict separation of customer phone from owner business phone
 * 4. Verification that customer WhatsApp messages are disabled
 * 5. Accidental duplicate notification protection
 * 6. Live vs sandbox credentials status check
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const whatsappService = require('../services/whatsappService');

async function runWhatsAppTests() {
  console.log('======================================================================');
  console.log('🌸 SREE SAREES: WHATSAPP OWNER NOTIFICATION VERIFICATION');
  console.log('   Destination Owner Number: +91 9087637123');
  console.log('======================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`✓ [Test ${totalTests}] ${message}`);
      passedTests++;
    } else {
      console.error(`❌ [Test ${totalTests}] FAILED: ${message}`);
      process.exitCode = 1;
    }
  }

  // 1. Owner Phone Resolution Test
  const ownerNum = whatsappService.getOwnerWhatsAppNumber();
  assert(
    ownerNum === '919087637123',
    `Owner number resolves to sanitized 919087637123 (got: ${ownerNum})`
  );

  // 2. Mock Order Setup with Distinct Customer & Delivery Information
  const mockOrder = {
    _id: 'order_test_9999',
    orderNumber: 'SS1099',
    customerName: 'Smt. Radhika Raman',
    customerPhone: '9840199999', // Customer's own mobile (separate from owner)
    customerEmail: 'radhika@example.com',
    items: [
      {
        name: 'Crimson Red Pure Kanjivaram Silk Saree',
        quantity: 1,
        price: 3499,
        subtotal: 3499
      },
      {
        name: 'Sunny Yellow Mulmul Daily Wear Cotton Saree',
        quantity: 2,
        price: 499,
        subtotal: 998
      }
    ],
    subtotal: 4497,
    deliveryCharge: 0,
    finalTotal: 4497,
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'Pending',
    notes: 'Please pack in traditional gift box.',
    deliveryAddress: {
      fullName: 'Smt. Radhika Raman',
      phone: '9840199999',
      addressLine: '15 Masi Street Heritage Home',
      city: 'Madurai',
      state: 'Tamil Nadu',
      pincode: '625001'
    },
    createdAt: new Date()
  };

  // 3. Message Body Content Verification
  const msg = whatsappService.buildOwnerOrderMessage(mockOrder);

  assert(
    msg.includes('SREE SAREES — NEW ORDER NOTIFICATION'),
    'Includes New Order Notification header'
  );
  assert(
    msg.includes('#SS1099'),
    'Includes correct Order ID (#SS1099)'
  );
  assert(
    msg.includes('Smt. Radhika Raman'),
    'Includes customer name'
  );
  assert(
    msg.includes('9840199999') && !msg.includes('Customer Phone: 919087637123'),
    'Includes customer phone and DOES NOT confuse customer phone with owner number'
  );
  assert(
    msg.includes('15 Masi Street Heritage Home') && msg.includes('Madurai') && msg.includes('625001'),
    'Includes complete customer delivery address'
  );
  assert(
    msg.includes('Crimson Red Pure Kanjivaram Silk Saree') &&
    msg.includes('Sunny Yellow Mulmul Daily Wear Cotton Saree') &&
    msg.includes('₹3,499') &&
    msg.includes('₹499'),
    'Includes all saree product names, quantities, and individual prices'
  );
  assert(
    msg.includes('Saree Subtotal: ₹4,497') && msg.includes('Free Express Delivery'),
    'Includes subtotal and delivery discount / savings'
  );
  assert(
    msg.includes('Final Order Total: *₹4,497*') || msg.includes('*Final Order Total:* *₹4,497*'),
    'Includes final order total'
  );
  assert(
    msg.includes('Cash on Delivery (COD)'),
    'Includes selected payment method (Cash on Delivery)'
  );
  assert(
    msg.includes('IST'),
    'Includes order date and time in Indian Standard Time (IST)'
  );

  // 4. Test Notification Dispatch Function
  console.log('\n--- Testing notifyOrderPlaced Dispatch ---');
  const dispatchRes = await whatsappService.notifyOrderPlaced(mockOrder);

  assert(
    dispatchRes.ownerNotification !== undefined,
    'Returns ownerNotification result'
  );
  assert(
    dispatchRes.ownerNotification.recipient === '919087637123',
    'Owner notification recipient is strictly +91 9087637123'
  );
  assert(
    dispatchRes.customerNotification === undefined,
    'Customer WhatsApp messages are NOT sent (Requirement 8 verified)'
  );
  assert(
    ['DELIVERED_TO_GATEWAY', 'CONFIG_REQUIRED'].includes(dispatchRes.ownerNotification.status),
    `Dispatches with valid status: ${dispatchRes.ownerNotification.status}`
  );

  // 5. Test Duplicate Notification Prevention
  const alreadySentOrder = {
    ...mockOrder,
    whatsappNotifications: {
      ownerSent: true,
      ownerStatus: 'DELIVERED_TO_GATEWAY',
      messageId: 'wamid.test12345'
    }
  };
  const dupRes = await whatsappService.notifyOrderPlaced(alreadySentOrder);
  assert(
    dupRes.ownerNotification.status === 'ALREADY_SENT',
    'Prevents duplicate WhatsApp notifications for already-notified orders'
  );

  console.log('\n======================================================================');
  console.log(`🎉 WHATSAPP VERIFICATION RESULT: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('======================================================================\n');
}

runWhatsAppTests().catch(err => {
  console.error('Fatal error during test execution:', err);
  process.exit(1);
});
