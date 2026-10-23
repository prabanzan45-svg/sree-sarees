import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Sparkles, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTarget = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(redirectTarget);
    } else {
      setError(result.message || 'Invalid credentials');
    }
  };

  const handleDemoFill = () => {
    setEmail('customer@example.com');
    setPassword('Customer@123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-boutique-gold/30 shadow-boutique-lg space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-boutique-goldDark">
            Customer Portal
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-boutique-maroon">
            Sign In to Sree Sarees
          </h1>
          <p className="text-xs text-boutique-muted">
            Access your orders, saved addresses, and express checkout.
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
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-boutique-gold/30 focus:border-boutique-maroon focus:ring-2 focus:ring-boutique-maroon/20 outline-none text-sm transition-all"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-boutique-gold/30 focus:border-boutique-maroon focus:ring-2 focus:ring-boutique-maroon/20 outline-none text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-boutique-maroon hover:bg-boutique-maroonDark text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-boutique transition-all active:scale-95"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Auto-Fill Button for Evaluators */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full py-2.5 px-4 rounded-xl bg-boutique-sand/50 hover:bg-boutique-sand text-boutique-maroon text-xs font-semibold border border-boutique-gold/30 flex items-center justify-center space-x-2 transition-all"
          >
            <UserCheck className="w-4 h-4 text-boutique-goldDark" />
            <span>Fill Demo Customer Credentials</span>
          </button>
        </div>

        <div className="pt-4 border-t border-gray-100 text-center space-y-2 text-xs">
          <p className="text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-boutique-maroon hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
