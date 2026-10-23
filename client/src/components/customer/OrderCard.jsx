import React, { useState } from 'react';
import { Package, Calendar, MapPin, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import api from '../../services/api';
import { handleImageError } from '../../utils/imageFallback';

const OrderCard = ({ order, onOrderCancelled }) => {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [error, setError] = useState('');

  const canCancel = order.orderStatus === 'Placed';

  const handleCancel = async () => {
    setCancelling(true);
    setError('');
    try {
      const res = await api.post(`/orders/${order._id || order.orderNumber}/cancel`, {
        reason: cancelReason || 'Cancelled by customer'
      });
      if (res.data.success) {
        setShowCancelModal(false);
        if (onOrderCancelled) onOrderCancelled(res.data.order);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-2xl border border-boutique-gold/25 shadow-sm overflow-hidden mb-6 transition-all">
      {/* Order Summary Bar */}
      <div className="p-6 bg-boutique-ivory/50 border-b border-boutique-gold/15 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="font-serif text-lg font-bold text-boutique-maroon">
              Order #{order.orderNumber}
            </span>
            <StatusBadge status={order.orderStatus} />
            <StatusBadge type="payment" status={order.paymentStatus} />
          </div>
          <div className="flex items-center text-xs text-boutique-muted space-x-2">
            <Calendar className="w-3.5 h-3.5 text-boutique-goldDark" />
            <span>Placed on {formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs text-boutique-muted">Total Amount</p>
            <p className="text-base font-bold text-boutique-maroon">
              ₹{order.finalTotal.toLocaleString('en-IN')}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-full hover:bg-boutique-sand/60 text-boutique-charcoal transition-colors"
            title="Toggle Details"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Preview: Items Summary */}
      <div className="p-6">
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                  alt={item.name}
                  onError={handleImageError}
                  className="w-14 h-16 object-cover object-top rounded-lg border border-boutique-gold/20"
                />
                <div>
                  <h4 className="text-sm font-semibold text-boutique-charcoal line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-boutique-goldDark">
                    {item.fabric} • Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-boutique-maroon">
                ₹{item.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>

        {/* Expanded View: Delivery Address & Payment Details */}
        {expanded && (
          <div className="mt-6 pt-6 border-t border-boutique-gold/15 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs animate-fadeIn">
            {/* Delivery Address */}
            <div className="bg-boutique-ivory/40 p-4 rounded-xl border border-boutique-gold/20">
              <div className="flex items-center space-x-2 text-boutique-maroon font-bold mb-2">
                <MapPin className="w-4 h-4 text-boutique-goldDark" />
                <span>Delivery Address</span>
              </div>
              <p className="font-semibold text-boutique-charcoal">{order.deliveryAddress?.fullName}</p>
              <p className="text-gray-600">{order.deliveryAddress?.addressLine}</p>
              <p className="text-gray-600">
                {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
              </p>
              <p className="text-gray-600 mt-1">Phone: {order.deliveryAddress?.phone}</p>
            </div>

            {/* Payment & Audit Summary */}
            <div className="bg-boutique-ivory/40 p-4 rounded-xl border border-boutique-gold/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-boutique-maroon font-bold mb-2">
                  <Package className="w-4 h-4 text-boutique-goldDark" />
                  <span>Payment & Fulfilment</span>
                </div>
                <p className="text-gray-600">
                  <span className="font-semibold">Method:</span> {order.paymentMethod === 'DIRECT_UPI_QR' ? 'Direct Google Pay / UPI QR' : 'UPI Payment Gateway'}
                </p>
                {order.paymentReference && (
                  <p className="text-gray-600 mt-0.5 truncate">
                    <span className="font-semibold">Ref / UTR:</span> {order.paymentReference}
                  </p>
                )}
                {order.notes && (
                  <p className="text-gray-600 mt-0.5">
                    <span className="font-semibold">Boutique Notes:</span> {order.notes}
                  </p>
                )}
              </div>

              {canCancel && (
                <div className="mt-4 pt-3 border-t border-boutique-gold/15">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center space-x-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Order & Restore Stock</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-boutique-gold/30">
            <h3 className="font-serif text-lg font-bold text-boutique-maroon mb-2 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span>Cancel Order #{order.orderNumber}?</span>
            </h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Are you sure you want to cancel this order? The sarees reserved for your order will be immediately returned to our boutique stock.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Reason for cancellation (optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Changed occasion date, ordered by mistake"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg focus:border-boutique-maroon outline-none"
              />
            </div>

            {error && <p className="text-xs text-rose-600 mb-3">{error}</p>}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center space-x-1"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
