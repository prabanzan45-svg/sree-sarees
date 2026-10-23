import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import SearchAndFilters from '../components/customer/SearchAndFilters';
import ProductGrid from '../components/customer/ProductGrid';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    fabric: searchParams.get('fabric') || 'All',
    colour: searchParams.get('colour') || 'All',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  // Keep state synced with URL
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }
  }, [searchParams]);

  // Fetch filtered products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.set('search', filters.search);
      if (filters.category && filters.category !== 'All') queryParams.set('category', filters.category);
      if (filters.fabric && filters.fabric !== 'All') queryParams.set('fabric', filters.fabric);
      if (filters.colour && filters.colour !== 'All') queryParams.set('colour', filters.colour);
      if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice);
      if (filters.sort) queryParams.set('sort', filters.sort);

      const res = await api.get(`/products?${queryParams.toString()}`);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Failed to fetch catalogue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      category: 'All',
      fabric: 'All',
      colour: 'All',
      maxPrice: '',
      sort: 'newest'
    });
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-boutique-goldDark">
          Boutique Catalogue
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-boutique-charcoal mt-1">
          Explore Handloom Sarees
        </h1>
        <p className="text-xs sm:text-sm text-boutique-muted mt-1">
          Showing {products.length} authentic handcrafted sarees available for delivery.
        </p>
      </div>

      {/* Filter Component */}
      <SearchAndFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Product Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        emptyMessage="No sarees found matching your active filters. Try searching for other fabrics or clearing budget bounds."
      />
    </div>
  );
};

export default Shop;
