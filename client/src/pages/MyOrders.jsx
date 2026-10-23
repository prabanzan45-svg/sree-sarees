import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import api from '../services/api';
import OrderCard from '../components/customer/OrderCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/my-orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderCancelled = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderNumber === updatedOrder.orderNumber ? updatedOrder : o))
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Retrieving your orders..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 pb-4 border-b border-boutique-gold/20 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-boutique-goldDark">
            Customer Orders
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-boutique-charcoal mt-1">
            My Order History
          </h1>
        </div>
        <Link
          to="/shop"
          className="text-xs font-bold text-boutique-maroon hover:underline flex items-center space-x-1"
        >
          <span>Shop More Sarees</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No Orders Placed Yet"
          description="You haven't placed any saree orders with Sree Sarees yet. Browse our handloom catalogue to find your dream drape."
          actionText="Start Shopping"
          actionLink="/shop"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order._id || order.orderNumber}
              order={order}
              onOrderCancelled={handleOrderCancelled}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
