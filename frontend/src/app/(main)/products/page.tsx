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
        <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          All Products
        </h1>

        {/* Search Bar */}
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative flex items-center">
            <MagnifyingGlassIcon className="absolute left-4 h-5 w-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-base-200 border-2 border-purple-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center bg-base-200/50 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
          {/* Category Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-400 mb-1 block">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-base-300 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-400 mb-1 block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 bg-base-300 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
            >
              <option value="createdAt">Newest First</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>

          {/* Order */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-400 mb-1 block">Order</label>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full px-4 py-2 bg-base-300 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
            >
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="w-full md:w-auto text-center md:text-left">
            <div className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
              <span className="text-sm font-semibold text-white">
                {products.length} of {pagination.total} products
              </span>
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