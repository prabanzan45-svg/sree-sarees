import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Filter, ShoppingBag, Eye, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/customer/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const COLLECTIONS = ['All', 'Cotton Sarees', 'Silk Sarees', 'Kalamkari Sarees', 'Fancy Sarees'];

const Offers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState('All');

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products');
        if (res.data.success) {
          // Filter products that have isOffer === true or have a discountPrice < price
          const offerItems = res.data.products.filter(
            p => p.isOffer || (p.discountPrice && p.discountPrice < p.price)
          );
          setProducts(offerItems);
        }
      } catch (err) {
        console.error('Error fetching offers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const filteredProducts = selectedCollection === 'All'
    ? products
    : products.filter(p => p.category === selectedCollection);

  return (
    <div className="min-h-screen bg-boutique-cream py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Hero Festive Offer Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-boutique-maroonDark via-boutique-maroon to-boutique-maroonLight p-8 sm:p-12 text-boutique-goldLight shadow-xl border border-boutique-gold/30">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-boutique-gold/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-boutique-gold/20 border border-boutique-gold/40 text-boutique-gold text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Exclusive Boutique Savings</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Special Festive Offers & Weaves
            </h1>
            <p className="text-sm sm:text-base text-boutique-goldLight/90 leading-relaxed font-sans">
              Discover handpicked sarees from our four timeless collections with genuine discounts of up to 25% off. Every saree is authentic, handwoven, and shipped directly with full purchase protection.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-boutique-gold">
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-md">
                ✓ Authentic Handlooms
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-md">
                ✓ Free Blouse Piece Included
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-md">
                ✓ Cash on Delivery Available
              </span>
            </div>
          </div>
        </div>

        {/* Collection Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-boutique-gold/20 pb-5">
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-boutique-maroon" />
            <h2 className="font-serif text-2xl font-bold text-boutique-charcoal">
              Active Offers ({filteredProducts.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {COLLECTIONS.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCollection(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  selectedCollection === cat
                    ? 'bg-boutique-maroon text-white shadow-md'
                    : 'bg-white text-boutique-charcoal border border-boutique-gold/30 hover:border-boutique-maroon hover:text-boutique-maroon'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner message="Loading festive offers..." />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-boutique-gold/20 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-boutique-goldLight/20 flex items-center justify-center text-boutique-maroon">
              <Tag className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-boutique-charcoal">
              No Offers in This Collection
            </h3>
            <p className="text-sm text-boutique-muted">
              Check back soon for upcoming festive clearance and exclusive weaver discounts.
            </p>
            <button
              onClick={() => setSelectedCollection('All')}
              className="inline-block px-5 py-2 rounded-full bg-boutique-maroon text-white text-xs font-semibold hover:bg-boutique-maroonDark transition-colors"
            >
              View All Offers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product._id || product.productId} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Offers;
