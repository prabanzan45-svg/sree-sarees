const storeAdapter = require('../config/storeAdapter');
const Order = require('../models/Order');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const { isMongoConnected } = require('../config/db');
const whatsappService = require('../services/whatsappService');

// @desc    Create new order with server-calculated totals & stock deduction
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res, next) => {
  try {
    const { items, paymentMethod, notes } = req.body;
    const deliveryAddress = req.body.deliveryAddress || req.body.shippingAddress;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add sarees before placing an order.'
      });
    }

    if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.addressLine || !deliveryAddress.city || !deliveryAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required delivery address fields.'
      });
    }

    // Server-side validation of stock and prices
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const prodId = item.productId || item._id;
      let prod;

      if (isMongoConnected()) {
        prod = (prodId.match(/^[0-9a-fA-F]{24}$/)) ? await Product.findById(prodId) : await Product.findOne({ productId: prodId });
      } else {
        prod = storeAdapter.findProductById(prodId);
      }

      if (!prod || !prod.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.name || prodId}" is currently unavailable.`
        });
      }

      const qty = Math.max(1, Number(item.quantity || 1));
      if (prod.stockQuantity < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${prod.name}". Only ${prod.stockQuantity} unit(s) left in boutique.`
        });
      }

      const verifiedPrice = prod.discountPrice || prod.price;
      const itemSubtotal = verifiedPrice * qty;
      subtotal += itemSubtotal;

      validatedItems.push({
        product: prod._id,
        productId: prod.productId,
        name: prod.name,
        price: verifiedPrice,
        quantity: qty,
        image: prod.images && prod.images[0] ? prod.images[0] : '',
        fabric: prod.fabric,
        colour: prod.colour,
        subtotal: itemSubtotal
      });
    }

    const deliveryCharge = subtotal >= 5000 ? 0 : 150;
    const finalTotal = subtotal + deliveryCharge;

    const normalizedPaymentMethod = paymentMethod === 'DIRECT_UPI_QR'
      ? 'DIRECT_UPI_QR'
      : paymentMethod === 'UPI_GATEWAY'
      ? 'UPI_GATEWAY'
      : 'CASH_ON_DELIVERY';

    const orderData = {
      customerId: req.user._id || req.user.id,
      customerName: deliveryAddress.fullName.trim() || req.user.name,
      customerEmail: req.user.email,
      customerPhone: deliveryAddress.phone.trim() || req.user.phone,
      items: validatedItems,
      deliveryAddress: {
        fullName: deliveryAddress.fullName.trim(),
        phone: deliveryAddress.phone.trim(),
        addressLine: deliveryAddress.addressLine.trim(),
        city: deliveryAddress.city.trim(),
        state: deliveryAddress.state ? deliveryAddress.state.trim() : 'Tamil Nadu',
        pincode: deliveryAddress.pincode.trim()
      },
      subtotal,
      deliveryCharge,
      finalTotal,
      paymentMethod: normalizedPaymentMethod,
      paymentStatus: 'Pending',
      notes: notes || ''
    };

    let newOrder;

    if (isMongoConnected()) {
      const orderCount = await Order.countDocuments();
      const orderNumber = 'SS' + (1000 + orderCount + 1);

      newOrder = await Order.create({
        orderNumber,
        customer: req.user._id,
        ...orderData
      });

      // Deduct stock in MongoDB & record StockMovement
      for (const item of validatedItems) {
        const prod = await Product.findOne({ productId: item.productId });
        if (prod) {
          const prev = prod.stockQuantity;
          prod.stockQuantity = Math.max(0, prev - item.quantity);
          await prod.save();

          await StockMovement.create({
            movementId: 'SM-' + Date.now().toString(36).toUpperCase(),
            productId: prod.productId,
            productName: prod.name,
            quantityChange: -item.quantity,
            previousStock: prev,
            newStock: prod.stockQuantity,
            reason: 'ORDER_PURCHASE',
            relatedOrderNumber: orderNumber,
            notes: `Sold ${item.quantity} unit(s) on Order #${orderNumber}`
          });
        }
      }
    } else {
      newOrder = storeAdapter.createOrder(orderData);
    }

    // Automatically trigger WhatsApp Business Order Notification to Store Owner (+91 9087637123)
    try {
      const notifResults = await whatsappService.notifyOrderPlaced(newOrder);

      // Save notification status
      const waNotifData = {
        ownerSent: notifResults.ownerNotification.sent,
        ownerStatus: notifResults.ownerNotification.status,
        recipient: notifResults.ownerNotification.recipient || '919087637123',
        messageId: notifResults.ownerNotification.messageId || null,
        messagePreview: notifResults.ownerNotification.messagePreview || null,
        error: notifResults.ownerNotification.error || null,
        updatedAt: new Date()
      };
      newOrder.whatsappNotifications = waNotifData;

      if (isMongoConnected()) {
        await newOrder.save();
      } else {
        storeAdapter.updateOrderNotifications(newOrder._id, waNotifData);
      }
    } catch (notifErr) {
      console.warn('[Order Controller] WhatsApp notification dispatch warning:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: normalizedPaymentMethod === 'CASH_ON_DELIVERY'
        ? 'Order placed successfully with Cash on Delivery!'
        : 'Order created successfully. Please complete payment.',
      order: newOrder
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in customer's order history
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
const getMyOrders = async (req, res, next) => {
  try {
    const customerId = (req.user._id || req.user.id).toString();
    let orders;

    if (isMongoConnected()) {
      orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    } else {
      orders = storeAdapter.getOrders({ customerId });
    }

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get order details by ID (Customer only sees own, Admin sees all)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    if (isMongoConnected()) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(id).populate('customer', 'name email phone');
      } else {
        order = await Order.findOne({ orderNumber: id }).populate('customer', 'name email phone');
      }
    } else {
      order = storeAdapter.findOrderById(id);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Security check: Only order owner or admin can view
    const customerId = order.customer ? (order.customer._id || order.customer).toString() : null;
    const currentUserId = (req.user._id || req.user.id).toString();

    if (req.user.role !== 'ADMIN' && customerId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own orders.'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel order (Only allowed if Placed) & Restore Stock
// @route   POST /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    let order;
    if (isMongoConnected()) {
      order = (id.match(/^[0-9a-fA-F]{24}$/)) ? await Order.findById(id) : await Order.findOne({ orderNumber: id });
    } else {
      order = storeAdapter.findOrderById(id);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Verify ownership
    const customerId = order.customer ? (order.customer._id || order.customer).toString() : null;
    const currentUserId = (req.user._id || req.user.id).toString();

    if (req.user.role !== 'ADMIN' && customerId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You cannot cancel this order.'
      });
    }

    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This order is already cancelled.'
      });
    }

    if (['Shipped', 'Delivered'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it has already been ${order.orderStatus.toLowerCase()}.`
      });
    }

    if (isMongoConnected()) {
      order.orderStatus = 'Cancelled';
      order.notes = reason ? `Cancelled by customer: ${reason}` : 'Cancelled by customer';
      await order.save();

      // Restore inventory in MongoDB
      for (const item of order.items) {
        const prod = await Product.findOne({ productId: item.productId });
        if (prod) {
          const prev = prod.stockQuantity;
          prod.stockQuantity = prev + item.quantity;
          await prod.save();

          await StockMovement.create({
            movementId: 'SM-' + Date.now().toString(36).toUpperCase(),
            productId: prod.productId,
            productName: prod.name,
            quantityChange: item.quantity,
            previousStock: prev,
            newStock: prod.stockQuantity,
            reason: 'ORDER_CANCELLED',
            relatedOrderNumber: order.orderNumber,
            notes: `Restored ${item.quantity} unit(s) due to order cancellation`
          });
        }
      }
    } else {
      order = storeAdapter.updateOrderStatus(order._id || order.id, 'Cancelled', reason || 'Cancelled by customer');
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully. Stock has been restored to boutique inventory.',
      order
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
};
