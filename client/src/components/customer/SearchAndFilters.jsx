import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Cotton Sarees',
  'Silk Sarees',
  'Kalamkari Sarees',
  'Fancy Sarees'
];

const FABRICS = [
  'All',
  'Handloom Cotton',
  'Chettinad Cotton',
  'Mulmul Cotton',
  'Mangalagiri Cotton',
  'Chanderi Cotton',
  'Soft Silk',
  'Art Silk',
  'Mysore Silk',
  'Pen Kalamkari',
  'Kalamkari Cotton',
  'Designer Brocade Organza',
  'Georgette Bandhej'
];

const COLOURS = [
  'All',
  'Maroon',
  'Emerald Green',
  'Mustard Gold',
  'Peacock Blue',
  'Crimson Red',
  'Deep Magenta',
  'Royal Navy',
  'Wine Plum',
  'Pastel Mint',
  'Sunny Yellow'
];

const SearchAndFilters = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-boutique-gold/25 shadow-sm mb-8 space-y-6">
      {/* Search Bar & Sort Dropdown */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-boutique-goldDark" />
          <input
            type="text"
            placeholder="Search by saree name, fabric, weave, or motif (e.g. Mangalagiri Cotton, Silk, Kalamkari, Organza)..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-boutique-gold/40 focus:border-boutique-maroon focus:ring-2 focus:ring-boutique-maroon/20 outline-none text-sm transition-all bg-boutique-ivory/30"
          />
        </div>

        <div className="w-full md:w-1/3 flex items-center justify-end space-x-3">
          <span className="text-xs font-semibold text-boutique-muted uppercase tracking-wider whitespace-nowrap">
            Sort By:
          </span>
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-boutique-gold/40 text-xs font-medium focus:border-boutique-maroon outline-none bg-white shadow-sm"
          >
            <option value="newest">New Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Category Pills (Strictly 4 Collections) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-boutique-goldDark uppercase tracking-wider">
            Collections (4 Main Categories)
          </span>
          <button
            onClick={onReset}
            className="text-xs text-boutique-muted hover:text-boutique-maroon flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onFilterChange('category', cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                filters.category === cat
                  ? 'bg-boutique-maroon text-white shadow-sm'
                  : 'bg-boutique-sand/50 text-boutique-charcoal hover:bg-boutique-goldLight/20 border border-boutique-gold/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Row: Fabric, Colour, Max Price */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        {/* Fabric */}
        <div>
          <label className="block text-xs font-semibold text-boutique-muted mb-1.5 uppercase tracking-wider">
            Fabric
          </label>
          <select
            value={filters.fabric || 'All'}
            onChange={(e) => onFilterChange('fabric', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-boutique-gold/30 text-xs bg-boutique-ivory/20 focus:border-boutique-maroon outline-none"
          >
            {FABRICS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Colour */}
        <div>
          <label className="block text-xs font-semibold text-boutique-muted mb-1.5 uppercase tracking-wider">
            Colour Palette
          </label>
          <select
            value={filters.colour || 'All'}
            onChange={(e) => onFilterChange('colour', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-boutique-gold/30 text-xs bg-boutique-ivory/20 focus:border-boutique-maroon outline-none"
          >
            {COLOURS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Price Slider */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-boutique-muted uppercase tracking-wider">
              Budget Range
            </label>
            <span className="text-xs font-bold text-boutique-maroon">
              {filters.maxPrice ? `Up to ₹${Number(filters.maxPrice).toLocaleString('en-IN')}` : 'Any Budget'}
            </span>
          </div>
          <input
            type="range"
            min="400"
            max="3000"
            step="100"
            value={filters.maxPrice || '3000'}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="w-full accent-boutique-maroon cursor-pointer h-2 bg-gray-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>₹499 (Chettinad)</span>
            <span>₹3,000 (Silk/Fancy)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
