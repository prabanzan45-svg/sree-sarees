import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import StatusBadge from '../common/StatusBadge';
import { handleImageError } from '../../utils/imageFallback';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = !isOutOfStock && product.stockQuantity <= (product.lowStockThreshold || 5);
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-boutique-gold/25 shadow-sm hover:shadow-boutique-lg transition-all duration-300 flex flex-col">
      {/* Product Image Section */}
      <div className="relative aspect-[3/4] overflow-hidden bg-boutique-sand/30">
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          onError={handleImageError}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1.5 z-10">
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-boutique-maroon text-white shadow-sm flex items-center space-x-1">
              <Tag className="w-3 h-3" />
              <span>{discountPercent}% OFF</span>
            </span>
          )}
          {isOutOfStock ? (
            <StatusBadge type="stock" status="OUT_OF_STOCK" />
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
              Only {product.stockQuantity} left!
            </span>
          ) : null}
        </div>

        {/* Category Pill Overlay */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-sm text-boutique-maroon border border-boutique-gold/30 shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Quick Action Overlay on Desktop */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 p-4">
          <Link
            to={`/products/${product.productId || product._id}`}
            className="p-3 bg-white text-boutique-maroon rounded-full hover:bg-boutique-goldLight transition-colors shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
            title="View Saree Details"
          >
            <Eye className="w-5 h-5" />
          </Link>
          {!isOutOfStock && (
            <button
              onClick={() => addToCart(product, 1)}
              className="p-3 bg-boutique-maroon text-white rounded-full hover:bg-boutique-maroonDark transition-colors shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
              title="Add to Cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Saree Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-boutique-muted mb-1.5">
            <span className="font-medium text-boutique-goldDark truncate max-w-[140px]">{product.fabric}</span>
            <span className="inline-flex items-center text-[11px] text-gray-500">
              <span className="w-2 h-2 rounded-full bg-boutique-gold mr-1"></span>
              {product.colour}
            </span>
          </div>

          <Link to={`/products/${product.productId || product._id}`}>
            <h3 className="font-serif text-sm sm:text-base font-bold text-boutique-charcoal group-hover:text-boutique-maroon transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Cart Button */}
        <div className="mt-4 pt-3 border-t border-boutique-gold/15 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-base sm:text-lg font-bold text-boutique-maroon">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-500 block">Inclusive of all taxes</span>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to={`/products/${product.productId || product._id}`}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-boutique-maroon bg-boutique-goldLight/20 hover:bg-boutique-goldLight/40 transition-colors"
            >
              Details
            </Link>

            <button
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-boutique-maroon text-white hover:bg-boutique-maroonDark active:scale-95 shadow-sm'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
