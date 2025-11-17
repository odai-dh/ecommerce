"use client";

import { Product } from '@/lib/types/product';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const rating = product.rating ?? 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300"
    >
      {/* Stock Badge */}
      {product.stock < 10 && product.stock > 0 && (
        <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
          Only {product.stock} left
        </div>
      )}

      {product.stock === 0 && (
        <div className="absolute top-3 left-3 z-20 bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-slate-700">
          Sold Out
        </div>
      )}

      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="block relative">
        <div className="relative w-full h-64 overflow-hidden bg-slate-900/50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>

          {/* Quick add overlay */}
          {product.stock > 0 && (
            <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
              >
                Quick Add
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <div className="mb-2">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 hover:text-cyan-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon
              key={index}
              className={`h-4 w-4 ${index < rating ? 'text-amber-400' : 'text-slate-600'}`}
            />
          ))}
          <span className="ml-2 text-sm text-slate-400">
            {rating > 0 ? `(${rating.toFixed(1)})` : '(New)'}
          </span>
        </div>

        {/* Price and Stock */}
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-2xl font-bold text-white">
              ${product.price.toFixed(2)}
            </span>
          </div>
          {product.stock > 0 ? (
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-md border border-emerald-500/30">
              In Stock
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-md border border-red-500/30">
              Sold Out
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            product.stock > 0
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-[1.02]'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCartIcon className="h-5 w-5" />
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </motion.button>
      </div>
    </motion.div>
  );
}
