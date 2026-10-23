require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB, isMongoConnected } = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const StockMovement = require('../models/StockMovement');
const { INITIAL_PRODUCTS } = require('../config/seedData');
const storeAdapter = require('../config/storeAdapter');

const seedAll = async () => {
  console.log('--- Sree Sarees: Database Seeder ---');
  await connectDB();

  if (isMongoConnected()) {
    console.log('[Seeder] Connected to MongoDB. Synchronizing collection seeds...');

    // 1. Seed Owner Admin
    const adminEmail = (process.env.ADMIN_EMAIL || 'owner@sreesarees.com').toLowerCase();
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'OwnerSecure@2026', salt);
      await User.create({
        name: process.env.ADMIN_NAME || 'Sree Sarees Owner',
        email: adminEmail,
        phone: process.env.ADMIN_PHONE || '+91 98401 23456',
        password: hashedPassword,
        role: 'ADMIN'
      });
      console.log(`[Seeder] Seeded Owner Admin account: ${adminEmail}`);
    } else {
      console.log(`[Seeder] Owner Admin account already exists: ${adminEmail}`);
    }

    // 2. Seed Demo Customer
    const custEmail = 'customer@example.com';
    let customerUser = await User.findOne({ email: custEmail });
    if (!customerUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Customer@123', salt);
      customerUser = await User.create({
        name: 'Priyanka Devi',
        email: custEmail,
        phone: '+91 98765 43210',
        password: hashedPassword,
        role: 'CUSTOMER'
      });
      console.log(`[Seeder] Seeded Demo Customer: ${custEmail}`);
    }

    // 3. Seed Products (Idempotent: update or insert by productId)
    for (const prodData of INITIAL_PRODUCTS) {
      const exists = await Product.findOne({ productId: prodData.productId });
      if (!exists) {
        await Product.create(prodData);
        await StockMovement.create({
          movementId: 'SM-INIT-' + prodData.productId,
          productId: prodData.productId,
          productName: prodData.name,
          quantityChange: prodData.stockQuantity,
          previousStock: 0,
          newStock: prodData.stockQuantity,
          reason: 'INITIAL_SEED',
          notes: 'Warehouse initial inventory stock'
        });
      }
    }
    console.log(`[Seeder] Ensured all ${INITIAL_PRODUCTS.length} saree catalogue entries in MongoDB.`);

    // 4. Seed initial order if empty
    const orderCount = await Order.countDocuments();
    if (orderCount === 0 && customerUser) {
      const firstSaree = await Product.findOne({ productId: 'SS-SLK-001' });
      if (firstSaree) {
        const order = await Order.create({
          orderNumber: 'SS1001',
          customer: customerUser._id,
          customerName: customerUser.name,
          customerEmail: customerUser.email,
          customerPhone: customerUser.phone,
          items: [
            {
              product: firstSaree._id,
              productId: firstSaree.productId,
              name: firstSaree.name,
              price: firstSaree.discountPrice || firstSaree.price,
              quantity: 1,
              image: firstSaree.images[0],
              fabric: firstSaree.fabric,
              colour: firstSaree.colour,
              subtotal: firstSaree.discountPrice || firstSaree.price
            }
          ],
          deliveryAddress: {
            fullName: 'Priyanka Devi',
            phone: '+91 98765 43210',
            addressLine: 'Flat 402, Royal Palms Residency, Anna Nagar',
            city: 'Chennai',
            state: 'Tamil Nadu',
            pincode: '600040'
          },
          subtotal: firstSaree.discountPrice || firstSaree.price,
          deliveryCharge: 0,
          finalTotal: firstSaree.discountPrice || firstSaree.price,
          orderStatus: 'Delivered',
          paymentStatus: 'Paid',
          paymentMethod: 'UPI_GATEWAY',
          paymentReference: 'pay_rzp_mock10012026',
          notes: 'Customer requested festive gift packaging'
        });

        await Payment.create({
          paymentId: 'PAY-SS1001-001',
          orderId: order._id,
          orderNumber: 'SS1001',
          paymentProvider: 'RAZORPAY_UPI',
          providerOrderId: 'order_rzp_mock1001',
          providerPaymentId: 'pay_rzp_mock10012026',
          upiReference: 'UPI/6281928192/GPay',
          amount: order.finalTotal,
          paymentStatus: 'Paid',
          verificationDetails: {
            method: 'Google Pay (UPI)',
            verifiedAt: new Date().toISOString()
          }
        });
        console.log('[Seeder] Seeded initial delivered order and payment record.');
      }
    }
  } else {
    console.log('[Seeder] Local Persistent JSON Store is active. Re-initializing files...');
    storeAdapter.init();
    storeAdapter.reseedProducts();
    console.log('[Seeder] Local Persistent JSON Store verified and seeded successfully with updated catalogue.');
  }

  console.log('[Seeder] Database seeding completed successfully.');
};

if (require.main === module) {
  seedAll().then(() => process.exit(0)).catch(err => {
    console.error('[Seeder Error]:', err);
    process.exit(1);
  });
}

module.exports = seedAll;
