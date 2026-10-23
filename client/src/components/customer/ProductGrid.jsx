import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';

const ProductGrid = ({ products, loading, emptyMessage = 'No sarees match your current filters.' }) => {
  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="lg" text="Curating Handloom Sarees..." />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No Sarees Found"
        description={emptyMessage}
        actionText="Reset Filters & Browse All"
        actionLink="/shop"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
      {products.map((product) => (
        <ProductCard key={product.productId || product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
