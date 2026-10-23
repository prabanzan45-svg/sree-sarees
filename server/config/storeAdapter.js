const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const files = {
  users: path.join(dataDir, 'users.json'),
  products: path.join(dataDir, 'products.json'),
  orders: path.join(dataDir, 'orders.json'),
  payments: path.join(dataDir, 'payments.json'),
  stockMovements: path.join(dataDir, 'stock_movements.json'),
  blouseEnquiries: path.join(dataDir, 'blouse_enquiries.json'),
  aariEnquiries: path.join(dataDir, 'aari_enquiries.json')
};

const { INITIAL_PRODUCTS } = require('./seedData');

class StoreAdapter {
  constructor() {
    this.init();
  }

  init() {
    // Seed default admin and products if files do not exist
    if (!fs.existsSync(files.users)) {
      const adminSalt = bcrypt.genSaltSync(10);
      const hashedAdminPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'OwnerSecure@2026', adminSalt);
      const initialUsers = [
        {
          _id: 'usr_admin_001',
          name: process.env.ADMIN_NAME || 'Sree Sarees Owner',
          email: (process.env.ADMIN_EMAIL || 'owner@sreesarees.com').toLowerCase(),
          phone: process.env.ADMIN_PHONE || '+91 98401 23456',
          password: hashedAdminPassword,
          role: 'ADMIN',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'usr_cust_001',
          name: 'Priyanka Devi',
          email: 'customer@example.com',
          phone: '+91 98765 43210',
          password: bcrypt.hashSync('Customer@123', 10),
          role: 'CUSTOMER',
          createdAt: new Date().toISOString()
        }
      ];
      this.write('users', initialUsers);
    }

    if (!fs.existsSync(files.products)) {
      const products = INITIAL_PRODUCTS.map((p, idx) => ({
        _id: `prod_${(idx + 1).toString().padStart(3, '0')}`,
        ...p,
        createdAt: new Date(Date.now() - (idx * 3600000)).toISOString()
      }));
      this.write('products', products);

      // Create initial stock movement logs
      const initialMovements = products.map(p => ({
        _id: 'sm_' + Math.random().toString(36).substring(2, 9),
        movementId: 'SM-INIT-' + p.productId,
        productId: p.productId,
        productName: p.name,
        quantityChange: p.stockQuantity,
        previousStock: 0,
        newStock: p.stockQuantity,
        reason: 'INITIAL_SEED',
        relatedOrderNumber: '',
        notes: 'Initial warehouse stock onboarding',
        timestamp: new Date().toISOString()
      }));
      this.write('stockMovements', initialMovements);
    }

    if (!fs.existsSync(files.orders)) {
      // Seed a realistic completed order so admin dashboard has historical data
      const sampleOrders = [
        {
          _id: 'ord_sample_001',
          orderNumber: 'SS1001',
          customer: 'usr_cust_001',
          customerName: 'Priyanka Devi',
          customerEmail: 'customer@example.com',
          customerPhone: '+91 98765 43210',
          items: [
            {
              productId: 'SS-SLK-001',
              name: 'Crimson Red Kanjivaram Style Soft Silk Saree',
              price: 1499,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1610030469854-e67c87c14a52?auto=format&fit=crop&w=800&q=80',
              fabric: 'Soft Silk',
              colour: 'Red',
              subtotal: 1499
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
          subtotal: 1499,
          deliveryCharge: 0,
          finalTotal: 1499,
          orderStatus: 'Delivered',
          paymentStatus: 'Paid',
          paymentMethod: 'UPI_GATEWAY',
          paymentReference: 'pay_rzp_mock10012026',
          notes: 'Customer requested festive gift packaging',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      this.write('orders', sampleOrders);
    }

    if (!fs.existsSync(files.payments)) {
      const samplePayments = [
        {
          _id: 'pay_sample_001',
          paymentId: 'PAY-SS1001-001',
          orderId: 'ord_sample_001',
          orderNumber: 'SS1001',
          paymentProvider: 'RAZORPAY_UPI',
          providerOrderId: 'order_rzp_mock1001',
          providerPaymentId: 'pay_rzp_mock10012026',
          upiReference: 'UPI/6281928192/GPay',
          amount: 1499,
          currency: 'INR',
          paymentStatus: 'Paid',
          verificationDetails: {
            method: 'Google Pay (UPI)',
            verifiedAt: new Date(Date.now() - 86400000 * 2).toISOString()
          },
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ];
      this.write('payments', samplePayments);
    }

    if (!fs.existsSync(files.stockMovements)) {
      this.write('stockMovements', []);
    }
  }

  reseedProducts() {
    const products = INITIAL_PRODUCTS.map((p, idx) => ({
      _id: `prod_${(idx + 1).toString().padStart(3, '0')}`,
      ...p,
      createdAt: new Date(Date.now() - (idx * 3600000)).toISOString()
    }));
    this.write('products', products);
    return products;
  }

  read(key) {
    try {
      const filePath = files[key];
      if (!fs.existsSync(filePath)) return [];
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content || '[]');
    } catch (err) {
      console.error(`[StoreAdapter] Error reading ${key}:`, err.message);
      return [];
    }
  }

  write(key, data) {
    try {
      const filePath = files[key];
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error(`[StoreAdapter] Error writing ${key}:`, err.message);
      return false;
    }
  }

  // --- Users ---
  getUsers() {
    return this.read('users');
  }

  findUserByEmail(email) {
    if (!email) return null;
    const users = this.read('users');
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findUserById(id) {
    if (!id) return null;
    const users = this.read('users');
    return users.find(u => u._id === id || u.id === id) || null;
  }

  createUser(userData) {
    const users = this.read('users');
    const newUser = {
      _id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: userData.name,
      email: userData.email.toLowerCase(),
      phone: userData.phone,
      password: userData.password, // already hashed
      role: userData.role || 'CUSTOMER',
      deliveryAddress: userData.deliveryAddress || {},
      whatsappConsent: userData.whatsappConsent !== false,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.write('users', users);
    return newUser;
  }

  // --- Products ---
  getProducts(query = {}) {
    let products = this.read('products');

    // Filter active unless admin explicitly queries all
    if (query.isActive !== undefined) {
      const activeFlag = query.isActive === 'true' || query.isActive === true;
      products = products.filter(p => p.isActive === activeFlag);
    } else if (!query.includeInactive) {
      products = products.filter(p => p.isActive !== false);
    }

    // Search by name or description
    if (query.search) {
      const term = query.search.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.fabric.toLowerCase().includes(term) ||
        p.colour.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (query.category && query.category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === query.category.toLowerCase());
    }

    // Filter by fabric
    if (query.fabric && query.fabric !== 'All') {
      products = products.filter(p => p.fabric.toLowerCase().includes(query.fabric.toLowerCase()));
    }

    // Filter by colour
    if (query.colour && query.colour !== 'All') {
      products = products.filter(p => p.colour.toLowerCase().includes(query.colour.toLowerCase()));
    }

    // Filter by price range
    if (query.minPrice) {
      const min = Number(query.minPrice);
      products = products.filter(p => (p.discountPrice || p.price) >= min);
    }
    if (query.maxPrice) {
      const max = Number(query.maxPrice);
      products = products.filter(p => (p.discountPrice || p.price) <= max);
    }

    // Sorting
    if (query.sort === 'price_asc') {
      products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (query.sort === 'price_desc') {
      products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (query.sort === 'name_asc') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: newest
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Compute stock status
    return products.map(p => ({
      ...p,
      stockStatus: p.stockQuantity <= 0 ? 'OUT_OF_STOCK' : (p.stockQuantity <= (p.lowStockThreshold || 5) ? 'LOW_STOCK' : 'IN_STOCK')
    }));
  }

  findProductById(id) {
    if (!id) return null;
    const products = this.read('products');
    const p = products.find(prod => prod._id === id || prod.productId === id);
    if (!p) return null;
    return {
      ...p,
      stockStatus: p.stockQuantity <= 0 ? 'OUT_OF_STOCK' : (p.stockQuantity <= (p.lowStockThreshold || 5) ? 'LOW_STOCK' : 'IN_STOCK')
    };
  }

  createProduct(productData) {
    const products = this.read('products');
    const newProduct = {
      _id: 'prod_' + Math.random().toString(36).substring(2, 9),
      productId: productData.productId || ('SS-PRD-' + (products.length + 1).toString().padStart(3, '0')),
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      discountPrice: productData.discountPrice ? Number(productData.discountPrice) : null,
      category: productData.category,
      fabric: productData.fabric,
      colour: productData.colour,
      occasion: productData.occasion || 'Festive & Traditional',
      images: Array.isArray(productData.images) && productData.images.length > 0 ? productData.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      stockQuantity: Math.max(0, Number(productData.stockQuantity || 0)),
      lowStockThreshold: Math.max(1, Number(productData.lowStockThreshold || 5)),
      isActive: productData.isActive !== false,
      createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    this.write('products', products);

    // Record initial stock movement
    this.recordStockMovement({
      productId: newProduct.productId,
      productName: newProduct.name,
      quantityChange: newProduct.stockQuantity,
      previousStock: 0,
      newStock: newProduct.stockQuantity,
      reason: 'RESTOCK',
      relatedOrderNumber: '',
      notes: 'New product onboarded to catalogue'
    });

    return newProduct;
  }

  updateProduct(id, updates) {
    const products = this.read('products');
    const index = products.findIndex(p => p._id === id || p.productId === id);
    if (index === -1) return null;

    const oldProduct = products[index];
    const prevStock = oldProduct.stockQuantity;

    // Handle stock quantity change with audit log
    if (updates.stockQuantity !== undefined && Number(updates.stockQuantity) !== prevStock) {
      const newStock = Math.max(0, Number(updates.stockQuantity));
      const diff = newStock - prevStock;
      this.recordStockMovement({
        productId: oldProduct.productId,
        productName: oldProduct.name,
        quantityChange: diff,
        previousStock: prevStock,
        newStock: newStock,
        reason: updates.reason || (diff > 0 ? 'RESTOCK' : 'MANUAL_ADJUSTMENT'),
        relatedOrderNumber: '',
        notes: updates.notes || 'Product stock updated by owner'
      });
    }

    const updated = {
      ...oldProduct,
      ...updates,
      _id: oldProduct._id,
      productId: oldProduct.productId,
      price: updates.price !== undefined ? Number(updates.price) : oldProduct.price,
      discountPrice: updates.discountPrice !== undefined ? (updates.discountPrice ? Number(updates.discountPrice) : null) : oldProduct.discountPrice,
      stockQuantity: updates.stockQuantity !== undefined ? Math.max(0, Number(updates.stockQuantity)) : oldProduct.stockQuantity,
      lowStockThreshold: updates.lowStockThreshold !== undefined ? Math.max(1, Number(updates.lowStockThreshold)) : oldProduct.lowStockThreshold,
      updatedAt: new Date().toISOString()
    };

    products[index] = updated;
    this.write('products', products);
    return updated;
  }

  deleteProduct(id) {
    const products = this.read('products');
    const index = products.findIndex(p => p._id === id || p.productId === id);
    if (index === -1) return false;
    // Soft-deactivate for audit safety
    products[index].isActive = false;
    products[index].updatedAt = new Date().toISOString();
    this.write('products', products);
    return true;
  }

  // --- Orders ---
  getOrders(query = {}) {
    let orders = this.read('orders');

    if (query.customerId) {
      orders = orders.filter(o => o.customer === query.customerId || (o.customer && o.customer._id === query.customerId));
    }

    if (query.orderStatus && query.orderStatus !== 'All') {
      orders = orders.filter(o => o.orderStatus.toLowerCase() === query.orderStatus.toLowerCase());
    }

    if (query.paymentStatus && query.paymentStatus !== 'All') {
      orders = orders.filter(o => o.paymentStatus.toLowerCase() === query.paymentStatus.toLowerCase());
    }

    if (query.search) {
      const s = query.search.toLowerCase().trim();
      orders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        o.customerEmail.toLowerCase().includes(s) ||
        o.customerPhone.includes(s)
      );
    }

    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return orders;
  }

  findOrderById(id) {
    if (!id) return null;
    const orders = this.read('orders');
    return orders.find(o => o._id === id || o.orderNumber === id) || null;
  }

  createOrder(orderData) {
    const orders = this.read('orders');
    const nextNum = 1000 + orders.length + 1;
    const orderNumber = 'SS' + nextNum;

    const newOrder = {
      _id: 'ord_' + Math.random().toString(36).substring(2, 9),
      orderNumber,
      customer: orderData.customerId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      items: orderData.items,
      deliveryAddress: orderData.deliveryAddress,
      subtotal: orderData.subtotal,
      deliveryCharge: orderData.deliveryCharge || 0,
      finalTotal: orderData.finalTotal,
      orderStatus: 'Placed',
      paymentStatus: orderData.paymentStatus || 'Pending',
      paymentMethod: orderData.paymentMethod || 'CASH_ON_DELIVERY',
      paymentReference: orderData.paymentReference || '',
      whatsappNotifications: orderData.whatsappNotifications || {
        ownerSent: false,
        ownerStatus: 'Not Attempted',
        recipient: '919087637123',
        messageId: '',
        messagePreview: '',
        error: ''
      },
      notes: orderData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(newOrder);
    this.write('orders', orders);

    // Deduct stock for each item & record movement
    orderData.items.forEach(item => {
      this.deductProductStock(item.productId, item.quantity, orderNumber);
    });

    return newOrder;
  }

  updateOrderStatus(orderId, orderStatus, notes = '') {
    const orders = this.read('orders');
    const index = orders.findIndex(o => o._id === orderId || o.orderNumber === orderId);
    if (index === -1) return null;

    const currentOrder = orders[index];
    const oldStatus = currentOrder.orderStatus;

    // If changing to Cancelled from non-cancelled, restore stock!
    if (orderStatus === 'Cancelled' && oldStatus !== 'Cancelled') {
      currentOrder.items.forEach(item => {
        this.restoreProductStock(item.productId, item.quantity, currentOrder.orderNumber, 'Order cancellation');
      });
    }

    currentOrder.orderStatus = orderStatus;
    if (notes) currentOrder.notes = notes;
    currentOrder.updatedAt = new Date().toISOString();

    orders[index] = currentOrder;
    this.write('orders', orders);
    return currentOrder;
  }

  updateOrderPayment(orderId, paymentStatus, paymentReference = '', upiRef = '') {
    const orders = this.read('orders');
    const index = orders.findIndex(o => o._id === orderId || o.orderNumber === orderId);
    if (index === -1) return null;

    orders[index].paymentStatus = paymentStatus;
    if (paymentReference) orders[index].paymentReference = paymentReference;
    orders[index].updatedAt = new Date().toISOString();

    this.write('orders', orders);

    // Also update payment record if exists
    const payments = this.read('payments');
    const pIndex = payments.findIndex(p => p.orderId === orders[index]._id || p.orderNumber === orders[index].orderNumber);
    if (pIndex !== -1) {
      payments[pIndex].paymentStatus = paymentStatus;
      if (upiRef) payments[pIndex].upiReference = upiRef;
      if (paymentReference) payments[pIndex].providerPaymentId = paymentReference;
      payments[pIndex].updatedAt = new Date().toISOString();
      this.write('payments', payments);
    }

    return orders[index];
  }

  updateOrderNotifications(orderId, notifData) {
    const orders = this.read('orders');
    const index = orders.findIndex(o => o._id === orderId || o.orderNumber === orderId);
    if (index === -1) return null;

    orders[index].whatsappNotifications = {
      ...(orders[index].whatsappNotifications || {}),
      ...notifData,
      updatedAt: new Date().toISOString()
    };
    orders[index].updatedAt = new Date().toISOString();
    this.write('orders', orders);
    return orders[index];
  }

  // --- Inventory & Stock Deductions ---
  deductProductStock(productId, quantity, orderNumber) {
    const products = this.read('products');
    const idx = products.findIndex(p => p.productId === productId || p._id === productId);
    if (idx === -1) return;

    const prevStock = products[idx].stockQuantity;
    const newStock = Math.max(0, prevStock - quantity);
    products[idx].stockQuantity = newStock;
    products[idx].updatedAt = new Date().toISOString();
    this.write('products', products);

    this.recordStockMovement({
      productId: products[idx].productId,
      productName: products[idx].name,
      quantityChange: -quantity,
      previousStock: prevStock,
      newStock: newStock,
      reason: 'ORDER_PURCHASE',
      relatedOrderNumber: orderNumber,
      notes: `Sold ${quantity} unit(s) for Order #${orderNumber}`
    });
  }

  restoreProductStock(productId, quantity, orderNumber, reasonText) {
    const products = this.read('products');
    const idx = products.findIndex(p => p.productId === productId || p._id === productId);
    if (idx === -1) return;

    const prevStock = products[idx].stockQuantity;
    const newStock = prevStock + quantity;
    products[idx].stockQuantity = newStock;
    products[idx].updatedAt = new Date().toISOString();
    this.write('products', products);

    this.recordStockMovement({
      productId: products[idx].productId,
      productName: products[idx].name,
      quantityChange: +quantity,
      previousStock: prevStock,
      newStock: newStock,
      reason: 'ORDER_CANCELLED',
      relatedOrderNumber: orderNumber,
      notes: `Restored ${quantity} unit(s) due to ${reasonText || 'Order Cancellation'}`
    });
  }

  // --- Stock Movements ---
  recordStockMovement(movementData) {
    const movements = this.read('stockMovements');
    const newEntry = {
      _id: 'sm_' + Math.random().toString(36).substring(2, 9),
      movementId: 'SM-' + Date.now().toString(36).toUpperCase(),
      productId: movementData.productId,
      productName: movementData.productName,
      quantityChange: movementData.quantityChange,
      previousStock: movementData.previousStock,
      newStock: movementData.newStock,
      reason: movementData.reason,
      relatedOrderNumber: movementData.relatedOrderNumber || '',
      notes: movementData.notes || '',
      timestamp: new Date().toISOString()
    };
    movements.unshift(newEntry);
    this.write('stockMovements', movements);
    return newEntry;
  }

  getStockMovements(productId = null) {
    let movements = this.read('stockMovements');
    if (productId) {
      movements = movements.filter(m => m.productId === productId);
    }
    return movements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  // --- Payments ---
  createPayment(paymentData) {
    const payments = this.read('payments');
    const newPayment = {
      _id: 'pay_' + Math.random().toString(36).substring(2, 9),
      paymentId: paymentData.paymentId || ('PAY-' + Date.now()),
      orderId: paymentData.orderId,
      orderNumber: paymentData.orderNumber,
      paymentProvider: paymentData.paymentProvider,
      providerOrderId: paymentData.providerOrderId || '',
      providerPaymentId: paymentData.providerPaymentId || '',
      upiReference: paymentData.upiReference || '',
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      paymentStatus: paymentData.paymentStatus || 'Pending',
      verificationDetails: paymentData.verificationDetails || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    payments.push(newPayment);
    this.write('payments', payments);
    return newPayment;
  }

  getPayments() {
    return this.read('payments');
  }

  findPaymentByOrderId(orderId) {
    const payments = this.read('payments');
    return payments.find(p => p.orderId === orderId || p.orderNumber === orderId) || null;
  }

  // --- Analytics & Reports ---
  getDashboardMetrics() {
    const products = this.read('products');
    const orders = this.read('orders');

    const totalOrders = orders.length;
    const newOrders = orders.filter(o => o.orderStatus === 'Placed').length;
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 5)).length;
    const outOfStockProducts = products.filter(p => p.stockQuantity === 0).length;

    // Verified sales: revenue from orders marked Paid (excluding cancelled or pending)
    const paidOrders = orders.filter(o => o.paymentStatus === 'Paid' && o.orderStatus !== 'Cancelled');
    const totalSales = paidOrders.reduce((sum, o) => sum + (o.finalTotal || 0), 0);

    // Recent orders (last 5)
    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    // Low stock alerts list
    const lowStockAlerts = products
      .filter(p => p.stockQuantity <= (p.lowStockThreshold || 5))
      .map(p => ({
        id: p._id,
        productId: p.productId,
        name: p.name,
        category: p.category,
        stockQuantity: p.stockQuantity,
        lowStockThreshold: p.lowStockThreshold || 5,
        status: p.stockQuantity === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK'
      }));

    // Monthly sales aggregation for Recharts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlySalesMap = {};
    months.forEach((m, i) => {
      monthlySalesMap[m] = { month: m, monthIndex: i, sales: 0, orders: 0 };
    });

    paidOrders.forEach(o => {
      const d = new Date(o.createdAt);
      if (d.getFullYear() === currentYear) {
        const mName = months[d.getMonth()];
        if (monthlySalesMap[mName]) {
          monthlySalesMap[mName].sales += o.finalTotal;
          monthlySalesMap[mName].orders += 1;
        }
      }
    });

    // Best-selling sarees calculation
    const salesByProduct = {};
    paidOrders.forEach(o => {
      o.items.forEach(item => {
        if (!salesByProduct[item.productId]) {
          salesByProduct[item.productId] = {
            productId: item.productId,
            name: item.name,
            fabric: item.fabric,
            unitsSold: 0,
            revenue: 0,
            image: item.image
          };
        }
        salesByProduct[item.productId].unitsSold += item.quantity;
        salesByProduct[item.productId].revenue += item.subtotal;
      });
    });

    const bestSellers = Object.values(salesByProduct)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    return {
      totalOrders,
      newOrders,
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalSales,
      recentOrders,
      lowStockAlerts,
      monthlySales: Object.values(monthlySalesMap).sort((a, b) => a.monthIndex - b.monthIndex),
      bestSellers
    };
  }

  getSalesReport() {
    const metrics = this.getDashboardMetrics();
    const products = this.read('products');
    const orders = this.read('orders');

    // Revenue by category
    const categoryRevenue = {};
    const paidOrders = orders.filter(o => o.paymentStatus === 'Paid' && o.orderStatus !== 'Cancelled');

    paidOrders.forEach(o => {
      o.items.forEach(item => {
        const prod = products.find(p => p.productId === item.productId);
        const cat = prod ? prod.category : 'Silk Sarees';
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + item.subtotal;
      });
    });

    const categoryBreakdown = Object.keys(categoryRevenue).map(cat => ({
      category: cat,
      revenue: categoryRevenue[cat]
    }));

    // Total inventory stock valuation
    const totalInventoryUnits = products.reduce((sum, p) => sum + p.stockQuantity, 0);
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.stockQuantity * p.price), 0);

    return {
      totalSales: metrics.totalSales,
      totalPaidOrders: paidOrders.length,
      averageOrderValue: paidOrders.length > 0 ? Math.round(metrics.totalSales / paidOrders.length) : 0,
      monthlySales: metrics.monthlySales,
      categoryBreakdown,
      bestSellers: metrics.bestSellers,
      inventorySummary: {
        totalProducts: products.length,
        totalUnits: totalInventoryUnits,
        totalValuation: totalInventoryValue,
        inStockCount: products.filter(p => p.stockQuantity > (p.lowStockThreshold || 5)).length,
        lowStockCount: metrics.lowStockProducts,
        outOfStockCount: metrics.outOfStockProducts
      }
    };
  }

  // ==========================================
  // BLOUSE STITCHING ENQUIRIES
  // ==========================================
  createBlouseEnquiry(data) {
    const list = this.read('blouseEnquiries');
    const enquiryId = 'BLS-' + Date.now().toString(36).toUpperCase();
    const newEnquiry = {
      _id: 'bls_' + Date.now().toString(36),
      enquiryId,
      ...data,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };
    list.unshift(newEnquiry);
    this.write('blouseEnquiries', list);
    return newEnquiry;
  }

  getBlouseEnquiries(filter = {}) {
    let list = this.read('blouseEnquiries');
    if (filter.status) {
      list = list.filter(e => e.status === filter.status);
    }
    return list;
  }

  // ==========================================
  // AARI WORK CLASS ENQUIRIES
  // ==========================================
  createAariEnquiry(data) {
    const list = this.read('aariEnquiries');
    const enquiryId = 'AARI-' + Date.now().toString(36).toUpperCase();
    const newEnquiry = {
      _id: 'aari_' + Date.now().toString(36),
      enquiryId,
      ...data,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };
    list.unshift(newEnquiry);
    this.write('aariEnquiries', list);
    return newEnquiry;
  }

  getAariEnquiries(filter = {}) {
    let list = this.read('aariEnquiries');
    if (filter.status) {
      list = list.filter(e => e.status === filter.status);
    }
    if (filter.preferredFormat) {
      list = list.filter(e => e.preferredFormat === filter.preferredFormat);
    }
    return list;
  }
}

const storeAdapter = new StoreAdapter();

module.exports = storeAdapter;
