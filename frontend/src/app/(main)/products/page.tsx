'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import ProductGrid from '../../components/product/ProductGrid';
import HeroPro from '@/app/components/layout/HeroPro';
import axios from 'axios';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1, limit: 12 });

  // Debounce search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: debouncedSearchTerm,
        category,
        sortBy,
        order,
        page: currentPage.toString(),
        limit: '12'
      });

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products?${params}`);

      if (response.data.products) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } else {
        // Fallback for old API format
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, category, sortBy, order, currentPage]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(() => {
    return ['all', 'electronics', 'clothing', 'books', 'home', 'sports'];
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <HeroPro />

      {/* Search and Filter Section */}
      <div className="mt-16 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
          All Products
        </h1>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-400" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-2 block">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              >
                <option value="createdAt">Newest First</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>

            {/* Order */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-2 block">Order</label>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              >
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="w-full px-4 py-2.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg">
                <span className="text-sm font-semibold text-white">
                  {products.length} of {pagination.total} results
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-400">No products found</p>
        </div>
      ) : (
        <>
          <ProductGrid products={products} />

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="join-item btn"
                  onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={currentPage === pagination.pages}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}