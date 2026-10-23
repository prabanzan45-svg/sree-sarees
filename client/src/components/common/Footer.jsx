import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, RefreshCw, Mail, Phone, MapPin, Award, Tag, Scissors } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-boutique-charcoal text-boutique-ivory pt-16 pb-8 border-t-4 border-boutique-gold/60">
      {/* Heritage Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6 border-b border-boutique-gold/20">
          <div className="flex items-center space-x-3">
            <Award className="w-8 h-8 text-boutique-gold flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-boutique-goldLight font-serif">Four Main Collections</h4>
              <p className="text-xs text-gray-400">Cotton, Silk, Kalamkari & Fancy</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Truck className="w-8 h-8 text-boutique-gold flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-boutique-goldLight font-serif">Pan-India Delivery</h4>
              <p className="text-xs text-gray-400">Cash on Delivery & Online UPI</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Scissors className="w-8 h-8 text-boutique-gold flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-boutique-goldLight font-serif">Bespoke Tailoring</h4>
              <p className="text-xs text-gray-400">Custom blouse measurements in inches</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-8 h-8 text-boutique-gold flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-boutique-goldLight font-serif">Aari Work Classes</h4>
              <p className="text-xs text-gray-400">Online live & Madurai offline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 text-sm">
        {/* Brand Column */}
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold text-boutique-gold">Sree Sarees</h3>
          <p className="text-xs italic text-boutique-goldLight font-serif tracking-wider">
            Tradition Woven with Elegance.
          </p>
          <p className="text-xs text-gray-300 leading-relaxed">
            Curating India's finest handloom cotton, lustrous silk, artisanal kalamkari, and shimmering fancy designer weaves directly from master artisans.
          </p>
          <div className="pt-2">
            <span className="inline-block px-3 py-1 bg-boutique-goldDark/30 text-boutique-goldLight rounded-full text-[11px] font-medium border border-boutique-gold/30">
              South Masi Street, Madurai
            </span>
          </div>
        </div>

        {/* Collections Links */}
        <div>
          <h4 className="font-serif text-sm font-bold text-boutique-goldLight mb-4 tracking-wider uppercase">
            Four Collections
          </h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li>
              <Link to="/shop?category=Cotton Sarees" className="hover:text-boutique-gold transition-colors">
                Cotton Sarees (10 Weaves)
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Silk Sarees" className="hover:text-boutique-gold transition-colors">
                Silk Sarees (10 Weaves)
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Kalamkari Sarees" className="hover:text-boutique-gold transition-colors">
                Kalamkari Sarees (10 Weaves)
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Fancy Sarees" className="hover:text-boutique-gold transition-colors">
                Fancy Sarees (10 Weaves)
              </Link>
            </li>
            <li className="pt-2">
              <Link to="/offers" className="text-boutique-gold font-bold hover:underline flex items-center gap-1">
                <span>Festive Offers (Up to 25% OFF)</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Traditional Services & Customer Care */}
        <div>
          <h4 className="font-serif text-sm font-bold text-boutique-goldLight mb-4 tracking-wider uppercase">
            Boutique Services
          </h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li>
              <Link to="/blouse-stitching" className="hover:text-boutique-gold transition-colors">
                Bespoke Blouse Stitching
              </Link>
            </li>
            <li>
              <Link to="/aari-work-class" className="hover:text-boutique-gold transition-colors">
                Aari Work Class (Online & Madurai)
              </Link>
            </li>
            <li>
              <Link to="/my-orders" className="hover:text-boutique-gold transition-colors">
                Track My Orders
              </Link>
            </li>
            <li>
              <span className="cursor-default text-gray-400">Pure Silk Care & Storage Guide</span>
            </li>
            <li>
              <span className="cursor-default text-gray-400">Cash on Delivery Available</span>
            </li>
          </ul>
        </div>

        {/* Boutique Location & Contact */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-bold text-boutique-goldLight mb-4 tracking-wider uppercase">
            Boutique & Training Studio
          </h4>
          <div className="flex items-start space-x-2 text-xs text-gray-300">
            <MapPin className="w-4 h-4 text-boutique-gold flex-shrink-0 mt-0.5" />
            <span>South Masi Street, Madurai, Tamil Nadu – 625001, India (Near Meenakshi Amman Temple)</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-300">
            <Phone className="w-4 h-4 text-boutique-gold flex-shrink-0" />
            <span>Owner Contact: +91 90000 00000 (Sample Placeholder)</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-300">
            <Mail className="w-4 h-4 text-boutique-gold flex-shrink-0" />
            <span>contact@sreesarees.com</span>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-black/40 border border-boutique-gold/20 text-[11px] text-gray-400">
            <p className="font-semibold text-boutique-goldLight">Final Year College Project Notice:</p>
            <p className="mt-1">
              Complete e-commerce & smart inventory system with verified local assets, Cash on Delivery, WhatsApp Cloud API notifications, and Sree AI assistant.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        <p>© 2026 Sree Sarees. Tradition Woven with Elegance. All Rights Reserved.</p>
        <p className="mt-1 text-[11px] text-gray-600">
          Crafted with React, Vite, Node.js, Express, and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
