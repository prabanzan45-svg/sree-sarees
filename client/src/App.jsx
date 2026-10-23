import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/customer/CartDrawer';
import SreeAIAssistant from './components/customer/SreeAIAssistant';
import ProtectedRoute from './components/common/ProtectedRoute';

// Customer Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import Register from './pages/Register';
import Offers from './pages/Offers';
import BlouseStitching from './pages/BlouseStitching';
import AariWorkClass from './pages/AariWorkClass';

const App = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-boutique-cream text-boutique-charcoal">
      {/* Customer Header Navigation */}
      <Navbar />

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />

      {/* Sree AI Shopping Assistant */}
      <SreeAIAssistant />

      <div className="flex-1">
        <Routes>
          {/* Public Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/blouse-stitching" element={<BlouseStitching />} />
          <Route path="/aari-work-class" element={<AariWorkClass />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Customer Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Customer Footer */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default App;
