import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, LogOut, Sparkles, Tag, Scissors, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const handleOpenAI = () => {
    window.dispatchEvent(new CustomEvent('open-sree-ai'));
    setMobileMenuOpen(false);
  };

  // Exactly the 10 links
  const categoryLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cotton', path: '/shop?category=Cotton Sarees' },
    { name: 'Silk', path: '/shop?category=Silk Sarees' },
    { name: 'Kalamkari', path: '/shop?category=Kalamkari Sarees' },
    { name: 'Fancy', path: '/shop?category=Fancy Sarees' },
    { name: 'Offers', path: '/offers', highlight: true, icon: Tag },
    { name: 'Blouse Stitching', path: '/blouse-stitching', icon: Scissors },
    { name: 'Aari Work Class', path: '/aari-work-class', icon: Award }
  ];

  return (
    <header className="sticky top-0 z-40 bg-boutique-ivory/95 backdrop-blur-md border-b border-boutique-gold/25 shadow-sm transition-all duration-300">
      
      {/* Top Heritage Announcement Banner */}
      <div className="bg-boutique-maroon text-boutique-goldLight py-1 px-4 text-center text-[11px] sm:text-xs tracking-wider flex items-center justify-between font-medium">
        <span className="hidden md:inline-block opacity-85">Authentic Handlooms • South Masi Street, Madurai</span>
        <span className="mx-auto font-sans">
          Festive Clearance Live • Free Blouse Piece with Every Saree
        </span>
        <span className="hidden md:inline-block text-boutique-gold text-[11px]">Instant WhatsApp Order Confirmations</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2">
          
          {/* Logo & Tagline */}
          <Link to="/" className="flex flex-col group py-1 flex-shrink-0">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wide text-boutique-maroon group-hover:text-boutique-maroonDark transition-colors">
              Sree Sarees
            </span>
            <span className="text-[10px] sm:text-xs font-serif italic tracking-widest text-boutique-goldDark -mt-0.5">
              Tradition Woven with Elegance.
            </span>
          </Link>

          {/* Desktop Nav Links (The 4 collections + Offers + Blouse + Aari) */}
          <nav className="hidden xl:flex items-center space-x-5 2xl:space-x-6 text-[13px] font-medium tracking-wide">
            {categoryLinks.map((link) => {
              const isOffers = link.name === 'Offers';
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => {
                    const isCurrent = link.path.includes('?')
                      ? location.pathname + location.search === link.path
                      : location.pathname === link.path;

                    return `transition-all py-1 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                      isCurrent
                        ? 'text-boutique-maroon border-boutique-gold font-bold'
                        : isOffers
                        ? 'text-amber-800 hover:text-amber-900 border-transparent font-semibold'
                        : 'text-boutique-charcoal border-transparent hover:text-boutique-maroon hover:border-boutique-gold/50'
                    }`;
                  }}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 text-boutique-goldDark flex-shrink-0" />}
                  <span>{link.name}</span>
                  {isOffers && (
                    <span className="ml-0.5 px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-bold rounded-full uppercase tracking-tighter animate-pulse">
                      Sale
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Bar: Sree AI, Cart, My Account */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            
            {/* Sree AI Assistant Trigger Button */}
            <button
              onClick={handleOpenAI}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-boutique-maroon to-boutique-maroonDark text-boutique-goldLight hover:shadow-md transition-all text-xs font-semibold border border-boutique-gold/40 group"
              title="Open Sree AI Shopping Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-boutique-gold animate-spin group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-sans">Sree AI</span>
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-boutique-maroon hover:bg-boutique-goldLight/20 transition-all duration-200"
              aria-label="Shopping Cart"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-boutique-maroon text-boutique-goldLight text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-boutique-ivory shadow-sm animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-boutique-sand/70 text-boutique-maroon hover:bg-boutique-goldLight/30 border border-boutique-gold/30 transition-all"
                  title="My Account"
                >
                  <div className="w-6 h-6 rounded-full bg-boutique-maroon text-boutique-goldLight flex items-center justify-center text-[11px] font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold hidden lg:inline-block max-w-[80px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-boutique-lg border border-boutique-gold/30 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-[11px] text-gray-500">Signed in as</p>
                      <p className="text-xs font-bold text-boutique-maroon truncate">{user.name}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 text-[9px] font-semibold rounded bg-boutique-goldLight/30 text-boutique-maroon">
                        Customer
                      </span>
                    </div>

                    <Link
                      to="/my-orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-boutique-ivory"
                    >
                      <ShoppingBag className="w-4 h-4 text-boutique-maroon" />
                      <span>My Orders</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 text-left border-t border-gray-100 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold rounded-full text-boutique-maroon hover:bg-boutique-goldLight/20 transition-all border border-boutique-maroon/20"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden md:inline-block px-3.5 py-1.5 text-xs font-semibold rounded-full bg-boutique-maroon text-boutique-ivory hover:bg-boutique-maroonDark transition-all shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-boutique-maroon"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Secondary desktop quick bar for screen sizes between lg and xl */}
      <div className="hidden lg:flex xl:hidden bg-boutique-sand/40 border-t border-boutique-gold/15 py-1.5 px-4 justify-center gap-5 text-xs font-medium">
        {categoryLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="text-boutique-charcoal hover:text-boutique-maroon transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-boutique-ivory border-b border-boutique-gold/30 px-4 pt-2 pb-6 space-y-2">
          {categoryLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-sm font-medium text-boutique-charcoal hover:text-boutique-maroon border-b border-boutique-gold/10"
            >
              <span>{link.name}</span>
              {link.name === 'Offers' && (
                <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold rounded-full">
                  Up to 25% OFF
                </span>
              )}
            </Link>
          ))}

          <button
            onClick={handleOpenAI}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-full bg-boutique-maroon text-boutique-goldLight text-xs font-bold mt-3"
          >
            <Sparkles className="w-4 h-4 text-boutique-gold" />
            <span>Chat with Sree AI Assistant</span>
          </button>

          {!isAuthenticated ? (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold text-boutique-maroon border border-boutique-maroon rounded-full"
              >
                Customer Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold bg-boutique-maroon text-white rounded-full shadow-sm"
              >
                Create Account
              </Link>
            </div>
          ) : (
            <div className="pt-2 border-t border-boutique-gold/20 flex flex-col space-y-1">
              <Link
                to="/my-orders"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-xs font-semibold text-boutique-maroon"
              >
                My Orders & Deliveries
              </Link>
              <button
                onClick={handleLogout}
                className="text-left py-2 text-xs font-semibold text-rose-700"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
