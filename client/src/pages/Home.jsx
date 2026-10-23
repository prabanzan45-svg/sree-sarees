import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Gem,
  Tag,
  Scissors,
  Video,
  MapPin,
  ChevronRight,
  Truck,
  MessageCircle
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/customer/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MAIN_COLLECTIONS = [
  {
    name: 'Cotton Sarees',
    tag: 'Breathable Handloom Comfort',
    desc: 'Pure Mangalagiri, Mulmul, Chettinad, and Chanderi handwoven cottons for everyday grace and summer comfort.',
    image: '/images/sarees/cotton-1.jpg',
    link: '/shop?category=Cotton Sarees',
    badge: '10 Handpicked Weaves'
  },
  {
    name: 'Silk Sarees',
    tag: 'Timeless Weaves of Grandeur',
    desc: 'Lustrous Kanjivaram style soft silks, pure art silks, and Mysore weaves featuring opulent pure gold zari borders.',
    image: '/images/sarees/silk-1.jpg',
    link: '/shop?category=Silk Sarees',
    badge: '10 Royal Silks'
  },
  {
    name: 'Kalamkari Sarees',
    tag: 'Artisanal Heritage Motifs',
    desc: 'Authentic pen and block-printed Kalamkari sarees depicting timeless peacock, temple, and floral vine artwork.',
    image: '/images/sarees/kalamkari-1.jpg',
    link: '/shop?category=Kalamkari Sarees',
    badge: '10 Artisan Pieces'
  },
  {
    name: 'Fancy Sarees',
    tag: 'Contemporary Shimmer & Grace',
    desc: 'Modern designer organza, shimmering tissue weaves, traditional bandhani, and evening party drapes with delicate embroidery.',
    image: '/images/sarees/fancy-1.jpg',
    link: '/shop?category=Fancy Sarees',
    badge: '10 Designer Weaves'
  }
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then((res) => {
        if (res.data.success && res.data.products) {
          // Display top 8 sarees as featured
          setFeaturedProducts(res.data.products.slice(0, 8));
        }
      })
      .catch((err) => {
        console.error('Failed to load featured sarees', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-boutique-ivory via-boutique-cream to-white pt-8 pb-16 sm:pt-16 sm:pb-24 border-b border-boutique-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-boutique-goldLight/30 border border-boutique-gold/40 text-boutique-maroon text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-boutique-goldDark" />
                <span>The Royal Handloom Collection • 4 Main Collections</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-boutique-charcoal leading-tight">
                Tradition Woven <br />
                <span className="text-maroon-gradient italic">with Elegance.</span>
              </h1>

              <p className="text-sm sm:text-base text-boutique-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover authentic handloom sarees handpicked from India's finest weaving clusters. Explore our 4 signature collections — Cotton, Silk, Kalamkari, and Fancy sarees — each accompanied by an unstitched blouse piece.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="px-8 py-3.5 rounded-full bg-boutique-maroon hover:bg-boutique-maroonDark text-white font-semibold text-sm flex items-center space-x-2 shadow-boutique-lg transition-all duration-300 active:scale-95"
                >
                  <span>Explore 4 Collections</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/offers"
                  className="px-8 py-3.5 rounded-full bg-white hover:bg-boutique-ivory text-boutique-maroon border border-boutique-gold font-semibold text-sm shadow-sm transition-all duration-300 flex items-center gap-1.5"
                >
                  <Tag className="w-4 h-4 text-boutique-goldDark" />
                  <span>View Festive Offers</span>
                </Link>
              </div>

              {/* Trust Pillars */}
              <div className="pt-6 border-t border-boutique-gold/15 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-boutique-maroon">40</p>
                  <p className="text-[11px] text-gray-500 font-medium">Authentic Sarees</p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-boutique-maroon">₹499</p>
                  <p className="text-[11px] text-gray-500 font-medium">Starting Handloom</p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-boutique-maroon">COD</p>
                  <p className="text-[11px] text-gray-500 font-medium">Cash on Delivery</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual (Traditional Indian Saree Boutique Display) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-boutique-gold to-boutique-goldLight opacity-40 blur-lg" />
                <div className="relative rounded-3xl overflow-hidden border-2 border-boutique-gold/60 shadow-2xl aspect-[3/4] bg-boutique-sand">
                  <img
                    src="/images/boutique-hero.jpg"
                    alt="Traditional Indian Saree Boutique Display"
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-boutique-gold/30 shadow-lg flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-boutique-goldDark font-bold">Heritage Handloom Store</p>
                      <p className="font-serif text-sm font-bold text-boutique-charcoal">South Masi St, Madurai</p>
                    </div>
                    <span className="font-bold text-boutique-maroon text-xs bg-boutique-goldLight/30 px-3 py-1 rounded-full">
                      Authentic Weaves
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Four Main Collections Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-boutique-goldDark">
            The Four Pillars of Tradition
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-boutique-charcoal">
            The 4 Saree Collections
          </h2>
          <p className="text-xs sm:text-sm text-boutique-muted">
            Strictly curated into four distinct handloom categories — each offering 10 authentic weaves with verified local photography.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MAIN_COLLECTIONS.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group relative rounded-2xl overflow-hidden bg-white border border-boutique-gold/25 shadow-sm hover:shadow-boutique-lg transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[3/4] overflow-hidden bg-boutique-sand/40 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-boutique-maroon">
                  {cat.badge}
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-semibold text-boutique-goldLight tracking-wider uppercase block">
                    {cat.tag}
                  </span>
                  <h3 className="font-serif text-xl font-bold tracking-wide">
                    {cat.name}
                  </h3>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <p className="text-xs text-boutique-muted line-clamp-2 leading-relaxed">{cat.desc}</p>
                <span className="text-xs font-semibold text-boutique-maroon group-hover:translate-x-1 transition-transform flex items-center pt-1 border-t border-gray-100">
                  <span>Explore {cat.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Dedicated Offers Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-boutique-maroonDark via-boutique-maroon to-boutique-maroonLight p-8 sm:p-12 text-white shadow-xl border border-boutique-gold/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-boutique-gold/20 text-boutique-gold text-xs font-bold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              <span>Festive Savings Event</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-white">
              Save Up to 25% on Handpicked Weaves
            </h3>
            <p className="text-xs sm:text-sm text-boutique-goldLight/90 leading-relaxed font-sans">
              Enjoy genuine festive discounts across Cotton, Silk, Kalamkari, and Fancy sarees. All offers include genuine discount badges, free unstitched blouse piece, and Cash on Delivery.
            </p>
          </div>
          <Link
            to="/offers"
            className="px-8 py-3.5 rounded-full bg-boutique-gold hover:bg-boutique-goldDark text-boutique-maroonDark font-extrabold text-xs tracking-wider uppercase shadow-lg transition-all flex items-center space-x-2 flex-shrink-0"
          >
            <span>Explore Offers Section</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. Traditional Services: Blouse Stitching & Aari Work Classes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-boutique-goldDark">
            Artisanal Heritage Services
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-boutique-charcoal">
            Traditional Tailoring & Masterclasses
          </h2>
          <p className="text-xs sm:text-sm text-boutique-muted">
            Beyond handcrafted sarees, Sree Sarees offers bespoke tailoring to your exact measurements and certified Aari embroidery training.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Service 1: Blouse Stitching */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-boutique-gold/30 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-boutique-goldLight/20 text-boutique-maroon rounded-2xl">
                  <Scissors className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-boutique-goldDark bg-boutique-sand/50 px-2.5 py-1 rounded-full">
                  Bespoke Tailoring
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-boutique-charcoal">
                  Bespoke Blouse Stitching
                </h3>
                <p className="text-xs text-boutique-muted leading-relaxed">
                  Have your blouse piece tailored to your exact measurements in inches. Choose your front and back necklines, sleeve styles, padding, and premium cotton lining. Quotes are personalized with no fake fixed pricing.
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-boutique-sand/20">
                <img
                  src="/images/blouse/tailoring-service.jpg"
                  alt="Blouse Tailoring & Stitching Service"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-boutique-charcoal font-medium">
                <div className="flex items-center gap-1.5">✓ Measurements in Inches</div>
                <div className="flex items-center gap-1.5">✓ 5–7 Day Turnaround</div>
                <div className="flex items-center gap-1.5">✓ Custom Necklines</div>
                <div className="flex items-center gap-1.5">✓ Direct Master Tailor Review</div>
              </div>
            </div>

            <Link
              to="/blouse-stitching"
              className="w-full text-center py-3 rounded-full bg-boutique-maroon hover:bg-boutique-maroonDark text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              Configure Measurements & Request Quote →
            </Link>
          </div>

          {/* Service 2: Aari Work Classes */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-boutique-gold/30 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-boutique-goldLight/20 text-boutique-maroon rounded-2xl">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-boutique-goldDark bg-boutique-sand/50 px-2.5 py-1 rounded-full">
                  Online & Madurai Offline
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-boutique-charcoal">
                  Authentic Aari Work Classes
                </h3>
                <p className="text-xs text-boutique-muted leading-relaxed">
                  Master traditional Aari and Maggam embroidery through hands-on guidance. Available via <strong>Online Live Sessions</strong> or <strong>Offline Classes in and around Madurai, Tamil Nadu</strong> with full materials starter kit included.
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-boutique-sand/20">
                <img
                  src="/images/aari/aari-1.jpg"
                  alt="Aari Work Embroidery Class"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-boutique-charcoal font-medium">
                <div className="flex items-center gap-1.5">✓ Online Live HD Sessions</div>
                <div className="flex items-center gap-1.5">✓ Madurai Studio Classroom</div>
                <div className="flex items-center gap-1.5">✓ Complete Starter Kit</div>
                <div className="flex items-center gap-1.5">✓ Beginner to Bridal Zari</div>
              </div>
            </div>

            <Link
              to="/aari-work-class"
              className="w-full text-center py-3 rounded-full bg-boutique-maroon hover:bg-boutique-maroonDark text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              Explore Curriculum & Enroll →
            </Link>
          </div>

        </div>
      </section>

      {/* 5. Featured Saree Catalogue Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-4 border-b border-boutique-gold/20">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-boutique-goldDark">
              Handpicked From 4 Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-boutique-charcoal mt-1">
              Featured Sarees
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-3 sm:mt-0 text-xs font-bold text-boutique-maroon hover:text-boutique-maroonDark flex items-center space-x-1"
          >
            <span>View Full 40-Saree Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner message="Fetching sarees from boutique inventory..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.productId || product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Brand Story & Madurai Boutique Heritage */}
      <section id="about-us" className="bg-boutique-ivory/80 py-16 border-y border-boutique-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-boutique-goldDark">
                Heritage & Craftsmanship
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-boutique-charcoal leading-snug">
                Where Indian Tradition Meets Modern Elegance
              </h2>
              <p className="text-xs sm:text-sm text-boutique-muted leading-relaxed">
                Founded with a deep reverence for Indian handloom heritage, <strong className="text-boutique-maroon">Sree Sarees</strong> brings authentic weaves directly from master artisans to discerning saree connoisseurs across India.
              </p>
              <p className="text-xs sm:text-sm text-boutique-muted leading-relaxed">
                Based in <strong className="text-boutique-charcoal">South Masi Street, Madurai, Tamil Nadu</strong>, our boutique serves as both a handloom showcase and an artisanal training center for traditional Aari and Maggam embroidery. Every saree is 100% verified, pure handloom, and accompanied by full purchase protection.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-white rounded-xl border border-boutique-gold/25 shadow-sm">
                  <MapPin className="w-6 h-6 text-boutique-goldDark mb-1" />
                  <h4 className="font-serif font-bold text-sm text-boutique-maroon">Madurai Studio</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">South Masi Street, Heritage Zone</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-boutique-gold/25 shadow-sm">
                  <MessageCircle className="w-6 h-6 text-boutique-goldDark mb-1" />
                  <h4 className="font-serif font-bold text-sm text-boutique-maroon">Instant WhatsApp</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Automated order alerts to phone</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-boutique-gold/40 shadow-xl aspect-video bg-boutique-sand">
                <img
                  src="/images/sarees/kalamkari-1.jpg"
                  alt="Authentic Kalamkari Handloom Saree"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
