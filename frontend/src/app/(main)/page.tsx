'use client';

import { useState, useEffect } from 'react';
import ProductGrid from '../components/product/ProductGrid';
import Hero from '../components/layout/Hero';
import FeaturesGrid from '../components/layout/FeaturesGrid';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  rating?: number;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=4&sortBy=createdAt&order=desc`);

        if (response.data.products) {
          // New API format with pagination
          setFeaturedProducts(response.data.products);
        } else {
          // Old API format
          setFeaturedProducts(response.data.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Set empty array on error to prevent app crash
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-base-200">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Hero />
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
        <FeaturesGrid />
      </div>
    </main>
  );
}
