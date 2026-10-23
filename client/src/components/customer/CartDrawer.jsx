import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { handleImageError } from '../../utils/imageFallback';

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryCharge,
    finalTotal,
    itemCount
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 5000;
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 bg-boutique-ivory border-b border-boutique-gold/25 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-boutique-maroon" />
              <h2 className="font-serif text-xl font-bold text-boutique-maroon">
                Your Shopping Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-boutique-sand text-boutique-charcoal transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress Banner */}
          <div className="bg-boutique-goldLight/20 px-6 py-3 border-b border-boutique-gold/20">
            {amountNeededForFree > 0 ? (
              <p className="text-xs text-boutique-maroon font-medium mb-1.5">
                Add <span className="font-bold">₹{amountNeededForFree.toLocaleString('en-IN')}</span> more to qualify for <span className="font-bold">Complimentary Express Shipping</span>!
              </p>
            ) : (
              <p className="text-xs text-emerald-800 font-bold flex items-center space-x-1 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>You've unlocked Complimentary Express Pan-India Delivery!</span>
              </p>
            )}
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-boutique-maroon h-full rounded-full transition-all duration-500"
                style={{ width: `${freeDeliveryPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-boutique-sand/50 flex items-center justify-center text-boutique-maroon mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-serif text-lg font-bold text-boutique-charcoal mb-1">
                  Your Bag is Empty
                </h3>
                <p className="text-xs text-boutique-muted max-w-xs mb-6">
                  Explore our handcrafted Kanjivaram, Banarasi, and party wear sarees to begin your selection.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 rounded-full bg-boutique-maroon text-white text-xs font-semibold hover:bg-boutique-maroonDark transition-all"
                >
                  Explore Sarees
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.productId || item._id}
                  className="flex space-x-4 p-3 rounded-xl bg-boutique-ivory/40 border border-boutique-gold/15 hover:border-boutique-gold/40 transition-all"
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                    alt={item.name}
                    onError={handleImageError}
                    className="w-20 h-24 object-cover object-top rounded-lg flex-shrink-0 border border-boutique-gold/20"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-boutique-charcoal line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId || item._id)}
                          className="text-gray-400 hover:text-rose-600 transition-colors ml-2"
                          title="Remove Saree"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-boutique-goldDark font-medium mt-0.5">
                        {item.fabric} • {item.colour}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-2 bg-white rounded-lg border border-boutique-gold/30 px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.productId || item._id, item.quantity - 1)}
                          className="text-boutique-charcoal hover:text-boutique-maroon"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-boutique-maroon px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId || item._id, item.quantity + 1)}
                          disabled={item.quantity >= (item.availableStock || 99)}
                          className={`text-boutique-charcoal hover:text-boutique-maroon ${
                            item.quantity >= (item.availableStock || 99) ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-boutique-maroon">
                          ₹{item.subtotal.toLocaleString('en-IN')}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-gray-500 block">
                            (₹{item.price.toLocaleString('en-IN')} each)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Totals & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-boutique-ivory border-t border-boutique-gold/25 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-boutique-muted">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-boutique-charcoal">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-boutique-muted">
                  <span>Pan-India Delivery</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">
                        FREE
                      </span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-boutique-gold/20 flex justify-between text-base font-bold text-boutique-maroon">
                  <span>Total Payable</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-gray-500 text-center">
                  Live stock reservation guaranteed upon checkout.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-6 rounded-full bg-boutique-maroon hover:bg-boutique-maroonDark text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-boutique transition-all active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <Link
                    to="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs text-boutique-maroon hover:underline font-medium"
                  >
                    View Detailed Cart Page
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
