import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/imageFallback';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryCharge,
    finalTotal,
    itemCount
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-boutique-sand/60 flex items-center justify-center text-boutique-maroon mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 opacity-40" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-boutique-charcoal mb-2">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-sm text-boutique-muted max-w-md mx-auto mb-8">
          Explore our handloom pure silk and bridal collection to add authentic sarees to your order.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-boutique-maroon text-white font-semibold text-sm hover:bg-boutique-maroonDark transition-all shadow-boutique"
        >
          <span>Explore Saree Catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-boutique-gold/20">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-boutique-goldDark">
            Order Review
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-boutique-charcoal mt-1">
            Shopping Bag ({itemCount} {itemCount === 1 ? 'Saree' : 'Sarees'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
        >
          Empty Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.productId || item._id}
              className="p-5 rounded-2xl bg-white border border-boutique-gold/20 shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5"
            >
              <img
                src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                alt={item.name}
                onError={handleImageError}
                className="w-24 h-32 object-cover object-top rounded-xl border border-boutique-gold/20 flex-shrink-0"
              />

              <div className="flex-1 w-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-boutique-charcoal">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.productId || item._id)}
                      className="text-gray-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-boutique-goldDark font-semibold mt-1">
                    Fabric: {item.fabric} • Shade: {item.colour}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  {/* Quantity selector */}
                  <div className="flex items-center space-x-3 bg-boutique-ivory rounded-xl border border-boutique-gold/30 px-3 py-1">
                    <button
                      onClick={() => updateQuantity(item.productId || item._id, item.quantity - 1)}
                      className="text-boutique-charcoal hover:text-boutique-maroon"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-boutique-maroon px-2 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId || item._id, item.quantity + 1)}
                      disabled={item.quantity >= (item.availableStock || 99)}
                      className="text-boutique-charcoal hover:text-boutique-maroon disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-bold text-boutique-maroon">
                      ₹{item.subtotal.toLocaleString('en-IN')}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-[11px] text-gray-500 block">
                        (₹{item.price.toLocaleString('en-IN')} each)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-boutique-maroon hover:underline pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping Sarees</span>
          </Link>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl p-6 border border-boutique-gold/25 shadow-sm sticky top-28 space-y-5">
            <h2 className="font-serif text-lg font-bold text-boutique-maroon border-b border-boutique-gold/20 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-boutique-muted">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-semibold text-boutique-charcoal">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-boutique-muted">
                <span>Estimated Delivery</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[11px]">
                      Complimentary (FREE)
                    </span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>
              <div className="pt-3 border-t border-boutique-gold/20 flex justify-between text-base font-bold text-boutique-maroon">
                <span>Total Amount</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-gray-400">
                Prices and live warehouse stock are verified upon order placement.
              </p>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-6 rounded-full bg-boutique-maroon hover:bg-boutique-maroonDark text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-boutique transition-all active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 bg-boutique-ivory rounded-xl border border-boutique-gold/20 text-[11px] text-gray-600 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-boutique-maroon">
                <ShieldCheck className="w-4 h-4 text-boutique-goldDark" />
                <span>Google Pay & UPI Protected</span>
              </div>
              <p>Direct encrypted payment verification on backend.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
