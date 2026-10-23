/**
 * Sree Sarees — Owner CLI Inventory & Stock Management Tool
 * Secure server-side utility to view and update stock/prices outside public web interface.
 *
 * Usage:
 *   node scripts/manage-inventory.js list
 *   node scripts/manage-inventory.js stock <productId> <newQuantity>
 *   node scripts/manage-inventory.js price <productId> <newPrice> [newDiscountPrice]
 */

const storeAdapter = require('../config/storeAdapter');

const args = process.argv.slice(2);
const command = args[0] ? args[0].toLowerCase() : 'help';

console.log('🌸 ==============================================================');
console.log('   SREE SAREES — SECURE INVENTORY MANAGEMENT CONSOLE');
console.log('   "Tradition Woven with Elegance."');
console.log('==============================================================\n');

switch (command) {
  case 'list': {
    const products = storeAdapter.getProducts();
    console.log(`Found ${products.length} products in catalogue:\n`);
    console.log('ID           | Category             | Price    | Stock | Name');
    console.log('-------------+----------------------+----------+-------+----------------------------------');
    products.forEach(p => {
      const priceStr = ('₹' + (p.discountPrice || p.price)).padEnd(8);
      const stockStr = String(p.stockQuantity).padEnd(5);
      const catStr = p.category.padEnd(20);
      const idStr = p.productId.padEnd(12);
      console.log(`${idStr} | ${catStr} | ${priceStr} | ${stockStr} | ${p.name.substring(0, 34)}`);
    });
    console.log('\n');
    break;
  }

  case 'stock': {
    const productId = args[1];
    const qty = parseInt(args[2], 10);
    if (!productId || isNaN(qty)) {
      console.error('❌ Usage: node scripts/manage-inventory.js stock <productId> <newQuantity>');
      process.exit(1);
    }
    const updated = storeAdapter.updateProduct(productId, { stockQuantity: qty });
    if (!updated) {
      console.error(`❌ Product "${productId}" not found.`);
      process.exit(1);
    }
    console.log(`✓ Stock for "${updated.name}" (${updated.productId}) successfully updated to ${qty} units.`);
    break;
  }

  case 'price': {
    const productId = args[1];
    const price = parseInt(args[2], 10);
    const disc = args[3] ? parseInt(args[3], 10) : null;
    if (!productId || isNaN(price)) {
      console.error('❌ Usage: node scripts/manage-inventory.js price <productId> <newPrice> [discountPrice]');
      process.exit(1);
    }
    const updates = { price };
    if (disc) updates.discountPrice = disc;
    const updated = storeAdapter.updateProduct(productId, updates);
    if (!updated) {
      console.error(`❌ Product "${productId}" not found.`);
      process.exit(1);
    }
    console.log(`✓ Price for "${updated.name}" (${updated.productId}) updated: MRP ₹${updated.price}, Offer ₹${updated.discountPrice || updated.price}.`);
    break;
  }

  default:
    console.log('Commands:');
    console.log('  list                                         - View all products and live stock levels');
    console.log('  stock <productId> <quantity>                 - Update stock quantity for a saree');
    console.log('  price <productId> <price> [discountPrice]   - Update price or festive offer price\n');
    break;
}
