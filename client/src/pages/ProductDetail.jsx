import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
  ArrowLeft
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { handleImageError } from '../utils/imageFallback';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then((res) => {
        if (res.data.success && res.data.product) {
          setProduct(res.data.product);
          setQuantity(1);
        }
      })
      .catch((err) => {
        console.error('Failed to load saree', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Unfolding Saree Details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-boutique-maroon mb-4">
          Saree Not Found
        </h2>
        <p className="text-sm text-boutique-muted mb-6">
          The requested saree may have been retired or does not exist.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 rounded-full bg-boutique-maroon text-white font-semibold text-xs"
        >
          Return to Saree Catalogue
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = !isOutOfStock && product.stockQuantity <= (product.lowStockThreshold || 5);
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back Link */}
      <Link
        to="/shop"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-boutique-maroon hover:text-boutique-maroonDark mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Saree Collection</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Saree Photography Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-boutique-sand/40 border-2 border-boutique-gold/30 shadow-boutique">
            <img
              src={product.images && product.images[selectedImage] ? product.images[selectedImage] : product.images[0]}
              alt={product.name}
              onError={handleImageError}
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500 ease-out"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-boutique-maroon text-white shadow-md">
                {discountPercent}% SPECIAL FESTIVE SAVING
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'border-boutique-maroon ring-2 ring-boutique-gold/50 shadow-md'
                      : 'border-boutique-gold/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} onError={handleImageError} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Stock Status */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-boutique-goldLight/30 text-boutique-maroon border border-boutique-gold/30">
                {product.category}
              </span>
              <StatusBadge type="stock" status={product.stockStatus || (isOutOfStock ? 'OUT_OF_STOCK' : isLowStock ? 'LOW_STOCK' : 'IN_STOCK')} />
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-boutique-charcoal leading-tight">
              {product.name}
            </h1>

            {/* Price Block */}
            <div className="p-4 rounded-2xl bg-boutique-ivory/60 border border-boutique-gold/25">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-extrabold text-boutique-maroon">
                  ₹{displayPrice.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Save ₹{(product.price - product.discountPrice).toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-boutique-muted mt-1">
                Inclusive of all taxes. Free express pan-India delivery on this saree.
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-boutique-gold/20">
                <span className="text-gray-400 uppercase tracking-wider font-semibold text-[10px] block">
                  Fabric Weave
                </span>
                <span className="font-bold text-boutique-maroon text-sm mt-0.5 block">
                  {product.fabric}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-boutique-gold/20">
                <span className="text-gray-400 uppercase tracking-wider font-semibold text-[10px] block">
                  Colour Shade
                </span>
                <span className="font-bold text-boutique-charcoal text-sm mt-0.5 block">
                  {product.colour}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-boutique-gold/20">
                <span className="text-gray-400 uppercase tracking-wider font-semibold text-[10px] block">
                  Saree Length
                </span>
                <span className="font-bold text-boutique-charcoal text-sm mt-0.5 block">
                  {product.sareeLength || '5.5 meters'}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-boutique-gold/20">
                <span className="text-gray-400 uppercase tracking-wider font-semibold text-[10px] block">
                  Blouse Piece
                </span>
                <span className="font-bold text-boutique-charcoal text-sm mt-0.5 block">
                  {product.blouseDetails || '0.8m unstitched'}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-boutique-gold/20">
                <span className="text-gray-400 uppercase tracking-wider font-semibold text-[10px] block">
                  Pattern / Motifs
                </span>
                <span className="font-bold text-boutique-charcoal text-sm mt-0.5 block truncate">
                  {product.pattern || product.occasion || 'Artisanal'}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-boutique-gold/20">
                <span className="text-gray-400 uppercase tracking-wider font-semibold text-[10px] block">
                  Stock Units Available
                </span>
                <span className={`font-bold text-sm mt-0.5 block ${isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-emerald-700'}`}>
                  {isOutOfStock ? '0 units (Sold Out)' : `${product.stockQuantity} in stock`}
                </span>
              </div>
            </div>

            {/* Custom Stitching Callout */}
            <div className="p-3.5 rounded-2xl bg-boutique-sand/40 border border-boutique-gold/30 flex items-center justify-between">
              <div className="text-xs text-boutique-charcoal">
                <span className="font-bold text-boutique-maroon">Need Custom Blouse Tailoring? </span>
                Get this blouse stitched to your exact measurements by our master tailors.
              </div>
              <Link
                to="/blouse-stitching"
                className="px-3 py-1.5 rounded-full bg-boutique-maroon text-white text-[11px] font-semibold hover:bg-boutique-maroonDark transition-all flex-shrink-0 ml-3"
              >
                Stitching Service →
              </Link>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2">
              <h3 className="font-serif text-sm font-bold text-boutique-charcoal uppercase tracking-wider">
                Saree Craftsmanship & Details
              </h3>
              <p className="text-xs sm:text-sm text-boutique-muted leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="pt-4 space-y-4">
              {!isOutOfStock && (
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-semibold text-boutique-muted uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="flex items-center space-x-3 bg-white border border-boutique-gold/30 rounded-xl px-3 py-1.5 shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="text-boutique-charcoal hover:text-boutique-maroon disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-boutique-maroon px-2 min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      disabled={quantity >= product.stockQuantity}
                      className="text-boutique-charcoal hover:text-boutique-maroon disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    (Max {product.stockQuantity} units)
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-6 rounded-full font-semibold text-sm flex items-center justify-center space-x-2 transition-all ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-boutique-maroon hover:bg-boutique-maroonDark text-white shadow-boutique active:scale-95'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
                </button>

                {!isOutOfStock && (
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-3.5 px-6 rounded-full bg-boutique-gold hover:bg-boutique-goldDark text-white font-semibold text-sm shadow-md transition-all active:scale-95"
                  >
                    Buy Now with Google Pay / UPI
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Genuine Trust & Care Box */}
          <div className="p-4 rounded-2xl bg-white border border-boutique-gold/25 space-y-2.5 text-xs text-gray-600">
            <div className="flex items-center space-x-2 font-semibold text-boutique-maroon">
              <Award className="w-4 h-4 text-boutique-goldDark" />
              <span>Sree Sarees Authenticity Assurance</span>
            </div>
            <ul className="space-y-1 text-[11px] text-boutique-muted list-disc list-inside">
              <li>100% pure silk weave certified with government-backed standards.</li>
              <li>Includes unstitched matching blouse piece (80 cm).</li>
              <li>Dry clean only recommended for fine zari & silk drapes.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
