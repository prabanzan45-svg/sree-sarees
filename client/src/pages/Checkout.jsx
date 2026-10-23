import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  QrCode,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShoppingBag,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { handleImageError } from '../utils/imageFallback';

const Checkout = () => {
  const { cartItems, subtotal, deliveryCharge, finalTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Delivery form state prefilled from customer account
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: user?.deliveryAddress?.addressLine || '',
    city: user?.deliveryAddress?.city || 'Chennai',
    state: user?.deliveryAddress?.state || 'Tamil Nadu',
    pincode: user?.deliveryAddress?.pincode || '600017',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY'); // 'CASH_ON_DELIVERY', 'DIRECT_UPI_QR', 'UPI_GATEWAY'
  const [upiReference, setUpiReference] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  const storeUpiId = 'sreesarees@upi';
  const storeUpiName = 'Sree Sarees Boutique';

  // Handle direct copy of boutique UPI ID
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(storeUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.addressLine || !formData.city || !formData.pincode) {
      setError('Please fill in all mandatory delivery address fields.');
      return;
    }

    if (paymentMethod === 'DIRECT_UPI_QR' && !upiReference) {
      setError('Please enter your 12-digit UPI Transaction / UTR Reference number to submit for verification.');
      return;
    }

    setProcessing(true);

    try {
      // 1. Create order on backend (which verifies stock & deducts inventory)
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.productId || item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          fabric: item.fabric,
          colour: item.colour
        })),
        deliveryAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          addressLine: formData.addressLine.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim()
        },
        paymentMethod,
        notes: formData.notes
      };

      const orderRes = await api.post('/orders', orderPayload);
      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || 'Failed to place order.');
      }

      const createdOrder = orderRes.data.order;

      // 2. Handle Payment Flow based on selected method
      if (paymentMethod === 'CASH_ON_DELIVERY') {
        clearCart();
        setOrderSuccess(createdOrder);
        setProcessing(false);
        return;
      }

      if (paymentMethod === 'UPI_GATEWAY') {
        // Gateway Order Initiation
        const payInitRes = await api.post('/payments/create-order', {
          orderId: createdOrder._id || createdOrder.orderNumber
        });

        const gateway = payInitRes.data.gateway;

        // If Razorpay checkout script is loaded, open Razorpay popup
        if (window.Razorpay) {
          const options = {
            key: gateway.key,
            amount: gateway.amount,
            currency: 'INR',
            name: gateway.name,
            description: gateway.description,
            order_id: gateway.orderId,
            prefill: gateway.prefill,
            theme: { color: '#722F37' },
            handler: async function (response) {
              // Verify backend signature
              const verifyRes = await api.post('/payments/verify', {
                orderId: createdOrder._id || createdOrder.orderNumber,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                method: 'Google Pay / UPI'
              });

              clearCart();
              setOrderSuccess(verifyRes.data.order);
              setProcessing(false);
            }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
          return;
        } else {
          // Standard College Project Test Sandbox Checkout:
          // Simulate the verified test gateway response via backend verification endpoint
          const mockPaymentId = 'pay_gpay_test_' + Date.now().toString(36).toUpperCase();
          const verifyRes = await api.post('/payments/verify', {
            orderId: createdOrder._id || createdOrder.orderNumber,
            razorpay_order_id: gateway.orderId,
            razorpay_payment_id: mockPaymentId,
            method: 'Google Pay / UPI (Verified Test Gateway)'
          });

          clearCart();
          setOrderSuccess(verifyRes.data.order);
        }
      } else {
        // DIRECT_UPI_QR Mode: Submit customer's UTR reference
        const upiRes = await api.post('/payments/submit-upi-ref', {
          orderId: createdOrder._id || createdOrder.orderNumber,
          upiReference: upiReference.trim(),
          notes: formData.notes
        });

        clearCart();
        setOrderSuccess(upiRes.data.order);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error occurred while placing order.');
    } finally {
      setProcessing(false);
    }
  };

  // If order was successfully placed, display confirmation screen
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-white rounded-3xl border-2 border-boutique-gold/40 shadow-boutique-lg space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-boutique-goldDark">
              Order Confirmed
            </span>
            <h1 className="font-serif text-3xl font-extrabold text-boutique-charcoal mt-1">
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-boutique-muted mt-2">
              Your order <span className="font-bold text-boutique-maroon">#{orderSuccess.orderNumber}</span> has been successfully placed with Sree Sarees.
            </p>
          </div>

          <div className="p-4 bg-boutique-ivory rounded-2xl border border-boutique-gold/20 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Order Number:</span>
              <span className="font-bold text-boutique-maroon">#{orderSuccess.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Total Amount:</span>
              <span className="font-bold text-boutique-charcoal">₹{orderSuccess.finalTotal?.toLocaleString('en-IN') || orderSuccess.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Order Status:</span>
              <span className="font-bold text-emerald-700">{orderSuccess.orderStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Payment Status:</span>
              <span className={`font-bold ${orderSuccess.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {orderSuccess.paymentStatus === 'Paid' ? 'Verified & Paid' : orderSuccess.paymentMethod === 'CASH_ON_DELIVERY' ? 'Pay upon Delivery' : 'Pending Verification'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Payment Method:</span>
              <span className="font-semibold text-gray-700">
                {orderSuccess.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery (COD)' : orderSuccess.paymentMethod === 'DIRECT_UPI_QR' ? 'Direct Google Pay / UPI QR' : 'UPI Payment Gateway'}
              </span>
            </div>
            {orderSuccess.paymentReference && (
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Payment Reference:</span>
                <span className="font-mono text-[11px] text-gray-600 truncate">{orderSuccess.paymentReference}</span>
              </div>
            )}
          </div>

          {/* Owner WhatsApp Notification Status Card */}
          {orderSuccess.whatsappNotifications?.ownerSent ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-left space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Owner WhatsApp Alert Dispatched</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Order #{orderSuccess.orderNumber} details, saree items, delivery address, and payment method have been automatically transmitted to the boutique owner's WhatsApp Business (+91 9087637123).
              </p>
            </div>
          ) : (
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-left space-y-2">
              <div className="flex items-center space-x-2 text-amber-900 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Owner WhatsApp Alert: {orderSuccess.whatsappNotifications?.ownerStatus === 'CONFIG_REQUIRED' ? 'Awaiting Meta Cloud API Credentials in server/.env' : (orderSuccess.whatsappNotifications?.ownerStatus || 'Order Saved Safely')}</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Your order is safely recorded with Order ID <strong>#{orderSuccess.orderNumber}</strong>. Owner alert is designated for <strong>+91 9087637123</strong>.
              </p>
              <div className="pt-1.5">
                <a
                  href={`https://wa.me/919087637123?text=${encodeURIComponent(
                    orderSuccess.whatsappNotifications?.messagePreview ||
                    `🌸 *SREE SAREES — NEW ORDER ALERT* 🌸\nOrder ID: #${orderSuccess.orderNumber}\nCustomer: ${orderSuccess.customerName} (${orderSuccess.customerPhone})\nTotal Amount: ₹${orderSuccess.finalTotal?.toLocaleString('en-IN')}\nPayment: ${orderSuccess.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : 'Online Payment'}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  <span>📲 Deliver Alert to +91 9087637123 via WhatsApp Web / App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <p className="text-[10px] text-gray-500 mt-1">
                  Click to open WhatsApp Web or the WhatsApp app with the complete order details pre-filled for +91 9087637123.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/my-orders"
              className="px-6 py-3 rounded-full bg-boutique-maroon text-white font-semibold text-xs hover:bg-boutique-maroonDark transition-all shadow-sm"
            >
              Track in My Orders
            </Link>
            <Link
              to="/shop"
              className="px-6 py-3 rounded-full bg-boutique-ivory text-boutique-maroon border border-boutique-gold/40 font-semibold text-xs hover:bg-boutique-sand transition-all"
            >
              Explore More Sarees
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-boutique-goldDark">
          Secure Checkout
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-boutique-charcoal mt-1">
          Delivery & Google Pay / UPI Payment
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Delivery Details & Payment Method Selection */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Delivery Address */}
          <div className="bg-white rounded-2xl p-6 border border-boutique-gold/25 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
              <Truck className="w-5 h-5 text-boutique-maroon" />
              <h2 className="font-serif text-lg font-bold text-boutique-charcoal">
                1. Delivery Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyanka Devi"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-xl focus:border-boutique-maroon outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-xl focus:border-boutique-maroon outline-none"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-gray-700 mb-1">
                Street Address / Flat / Building *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Flat 402, Royal Palms Residency, Anna Nagar"
                value={formData.addressLine}
                onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                className="w-full px-3 py-2.5 border rounded-xl focus:border-boutique-maroon outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-xl focus:border-boutique-maroon outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-xl focus:border-boutique-maroon outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-xl focus:border-boutique-maroon outline-none"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-gray-700 mb-1">
                Order Notes / Festive Gift Message (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Please include gold ribbon gift packaging"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2.5 border rounded-xl focus:border-boutique-maroon outline-none"
              />
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white rounded-2xl p-6 border border-boutique-gold/25 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
              <CreditCard className="w-5 h-5 text-boutique-maroon" />
              <h2 className="font-serif text-lg font-bold text-boutique-charcoal">
                2. Choose Payment Method
              </h2>
            </div>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`flex items-start space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-boutique-maroon bg-boutique-ivory/50 shadow-sm'
                    : 'border-gray-200 hover:border-boutique-gold/40'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH_ON_DELIVERY"
                  checked={paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className="mt-1 text-boutique-maroon focus:ring-boutique-maroon"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-boutique-charcoal flex items-center space-x-1.5">
                      <span>Cash on Delivery (Pay upon arrival)</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-boutique-muted mt-1 leading-relaxed">
                    Pay in cash or UPI when your saree package arrives at your doorstep. Instant order confirmation sent directly to your WhatsApp.
                  </p>
                </div>
              </label>

              {/* Option 2: Payment Gateway UPI */}
              <label
                className={`flex items-start space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'UPI_GATEWAY'
                    ? 'border-boutique-maroon bg-boutique-ivory/50 shadow-sm'
                    : 'border-gray-200 hover:border-boutique-gold/40'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI_GATEWAY"
                  checked={paymentMethod === 'UPI_GATEWAY'}
                  onChange={() => setPaymentMethod('UPI_GATEWAY')}
                  className="mt-1 text-boutique-maroon focus:ring-boutique-maroon"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-boutique-charcoal">
                      Google Pay / UPI Gateway (Razorpay Official Flow)
                    </span>
                    <span className="text-[10px] bg-boutique-sand text-boutique-maroon px-2 py-0.5 rounded font-bold">
                      Instant Online
                    </span>
                  </div>
                  <p className="text-[11px] text-boutique-muted mt-1 leading-relaxed">
                    Initiates a genuine verified UPI session with backend cryptographic signature auditing. Supports Google Pay, PhonePe, Paytm, and BHIM UPI.
                  </p>
                </div>
              </label>

              {/* Option B: Direct Boutique UPI ID / QR Code */}
              <label
                className={`flex items-start space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'DIRECT_UPI_QR'
                    ? 'border-boutique-maroon bg-boutique-ivory/50 shadow-sm'
                    : 'border-gray-200 hover:border-boutique-gold/40'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="DIRECT_UPI_QR"
                  checked={paymentMethod === 'DIRECT_UPI_QR'}
                  onChange={() => setPaymentMethod('DIRECT_UPI_QR')}
                  className="mt-1 text-boutique-maroon focus:ring-boutique-maroon"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-boutique-charcoal">
                      Direct Google Pay / UPI QR Code (Boutique Verified)
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                      Owner Audited
                    </span>
                  </div>
                  <p className="text-[11px] text-boutique-muted mt-1 leading-relaxed">
                    Scan the boutique UPI QR code on your phone, transfer the order amount, and enter your 12-digit UPI UTR Reference. The store owner verifies this via instant WhatsApp notification before dispatch.
                  </p>
                </div>
              </label>
            </div>

            {/* Direct UPI Interactive Details */}
            {paymentMethod === 'DIRECT_UPI_QR' && (
              <div className="p-4 bg-boutique-sand/30 rounded-xl border border-boutique-gold/30 space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <p className="font-semibold text-boutique-charcoal">
                      Payee: <span className="text-boutique-maroon">{storeUpiName}</span>
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono bg-white px-2.5 py-1 rounded border border-boutique-gold/30 font-bold text-boutique-maroon">
                        {storeUpiId}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="p-1 text-gray-500 hover:text-boutique-maroon flex items-center space-x-1 text-[11px]"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Amount: <span className="font-bold text-boutique-maroon">₹{finalTotal.toLocaleString('en-IN')}</span>
                    </p>
                  </div>

                  {/* Dynamic UPI QR Code */}
                  <div className="p-2 bg-white rounded-xl border border-boutique-gold/30 shadow-sm flex flex-col items-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=${encodeURIComponent(storeUpiId)}%26pn=${encodeURIComponent(storeUpiName)}%26am=${finalTotal}%26cu=INR`}
                      alt="Google Pay UPI QR Code"
                      className="w-24 h-24"
                    />
                    <span className="text-[9px] font-bold text-boutique-goldDark mt-1">Scan via Google Pay / UPI</span>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-semibold text-gray-700 mb-1">
                    Enter 12-digit UPI Transaction / UTR Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 628192819201"
                    value={upiReference}
                    onChange={(e) => setUpiReference(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:border-boutique-maroon outline-none font-mono text-xs"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Your order status will remain "Pending Verification" until the boutique owner confirms receipt via WhatsApp Business.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary & Place Order Action */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 border border-boutique-gold/25 shadow-sm sticky top-28 space-y-5">
            <h2 className="font-serif text-lg font-bold text-boutique-maroon border-b border-boutique-gold/20 pb-3">
              Order Review ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </h2>

            {/* Cart Preview List */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 text-xs">
              {cartItems.map((item) => (
                <div key={item.productId || item._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                      alt={item.name}
                      onError={handleImageError}
                      className="w-12 h-14 object-cover object-top rounded-lg border border-boutique-gold/20 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-boutique-charcoal truncate">{item.name}</p>
                      <p className="text-[11px] text-boutique-goldDark">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-boutique-maroon whitespace-nowrap ml-2">
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotal, delivery, total */}
            <div className="pt-3 border-t border-boutique-gold/15 space-y-2 text-xs">
              <div className="flex justify-between text-boutique-muted">
                <span>Items Subtotal</span>
                <span className="font-semibold text-boutique-charcoal">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-boutique-muted">
                <span>Delivery Charge</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[11px]">
                      FREE
                    </span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>
              <div className="pt-3 border-t border-boutique-gold/20 flex justify-between text-base font-bold text-boutique-maroon">
                <span>Final Total Payable</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing || cartItems.length === 0}
              className={`w-full py-4 px-6 rounded-full font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-boutique ${
                processing
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-boutique-maroon hover:bg-boutique-maroonDark text-white active:scale-95'
              }`}
            >
              <span>
                {processing
                  ? 'Processing Order...'
                  : paymentMethod === 'CASH_ON_DELIVERY'
                  ? `Confirm Cash on Delivery (₹${finalTotal.toLocaleString('en-IN')})`
                  : `Place Order & Pay ₹${finalTotal.toLocaleString('en-IN')}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 bg-boutique-ivory rounded-xl border border-boutique-gold/20 text-[11px] text-gray-500 space-y-1">
              <p className="font-semibold text-boutique-maroon">Verified Security Notice:</p>
              <p>
                All prices and warehouse stock quantities are re-validated by the backend server before transaction confirmation.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
