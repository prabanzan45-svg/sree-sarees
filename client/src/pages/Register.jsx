import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    addressLine: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
    whatsappConsent: true
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleDemoFill = () => {
    setFormData({
      name: 'Priya Sundaram',
      email: `priya_${Date.now().toString().slice(-4)}@example.com`,
      phone: '+91 98401 54321',
      password: 'Customer@123',
      confirmPassword: 'Customer@123',
      addressLine: '42 Lotus Garden, T Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600017',
      whatsappConsent: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      deliveryAddress: {
        addressLine: formData.addressLine.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim()
      },
      whatsappConsent: formData.whatsappConsent
    });
    setLoading(false);

    if (result.success) {
      navigate('/shop');
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-boutique-gold/30 shadow-boutique-lg space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-boutique-goldDark">
            New Customer Registration
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-boutique-maroon">
            Create an Account
          </h1>
          <p className="text-xs text-boutique-muted">
            Join Sree Sarees for authentic handlooms and instant WhatsApp order tracking.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Priya Sundaram"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-boutique-gold/30 focus:border-boutique-maroon focus:ring-2 focus:ring-boutique-maroon/20 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-boutique-gold/30 focus:border-boutique-maroon focus:ring-2 focus:ring-boutique-maroon/20 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              WhatsApp Mobile Number *
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-boutique-gold/30 focus:border-boutique-maroon focus:ring-2 focus:ring-boutique-maroon/20 outline-none text-sm"
            />
            <p className="text-[10px] text-gray-500 mt-0.5">Order confirmations and delivery alerts will be sent here.</p>
          </div>

          <div className="p-3 rounded-xl bg-boutique-ivory/60 border border-boutique-gold/25 space-y-2.5">
            <span className="font-serif font-bold text-xs text-boutique-maroon block">
              Delivery Address
            </span>

            <div>
              <input
                type="text"
                placeholder="Flat / House / Street Address"
                value={formData.addressLine}
                onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-boutique-gold/30 bg-white focus:border-boutique-maroon outline-none text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-boutique-gold/30 bg-white focus:border-boutique-maroon outline-none text-xs"
              />
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-boutique-gold/30 bg-white focus:border-boutique-maroon outline-none text-xs"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-boutique-gold/30 bg-white focus:border-boutique-maroon outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                placeholder="Min. 6 chars"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-boutique-gold/30 focus:border-boutique-maroon focus:ring-2 focus:ring-boutique-maroon/20 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                placeholder="Re-type password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-boutique-gold/30 focus:border-boutique-maroon focus:ring-2 focus:ring-boutique-maroon/20 outline-none text-sm"
              />
            </div>
          </div>

          {/* WhatsApp Consent Checkbox */}
          <div className="flex items-start space-x-2 pt-1">
            <input
              type="checkbox"
              id="whatsappConsent"
              checked={formData.whatsappConsent}
              onChange={(e) => setFormData({ ...formData, whatsappConsent: e.target.checked })}
              className="mt-0.5 rounded text-boutique-maroon focus:ring-boutique-maroon"
            />
            <label htmlFor="whatsappConsent" className="text-[11px] text-gray-600 leading-tight cursor-pointer">
              Send me automated order confirmations, dispatch receipts, and delivery updates via <span className="font-semibold text-emerald-800">WhatsApp Business</span>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-boutique-maroon hover:bg-boutique-maroonDark text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-boutique transition-all active:scale-95"
          >
            <span>{loading ? 'Creating Account...' : 'Register as Customer'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fill Helper */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full py-2 px-3 rounded-xl bg-boutique-sand/40 hover:bg-boutique-sand text-boutique-maroon text-[11px] font-semibold border border-boutique-gold/25 transition-all"
          >
            Quick Fill Demo Registration Form
          </button>
        </div>

        <div className="pt-4 border-t border-gray-100 text-center text-xs">
          <p className="text-gray-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-boutique-maroon hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
