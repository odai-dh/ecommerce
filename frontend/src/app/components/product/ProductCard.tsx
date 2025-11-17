"use client";

import { Product } from '@/lib/types/product';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { StarIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-gradient-to-br from-base-300 to-base-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity duration-300 z-10 pointer-events-none`}></div>

      {/* Badge */}
      {product.stock < 10 && product.stock > 0 && (
        <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          Only {product.stock} left!
        </div>
      )}

      {product.stock === 0 && (
        <div className="absolute top-4 left-4 z-20 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          Out of Stock
        </div>
      )}

      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="block relative">
        <div className="relative w-full h-64 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />

          {/* Gradient overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Quick actions overlay */}
          <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Link
              href={`/products/${product.id}`}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110"
            >
              <EyeIcon className="h-5 w-5" />
            </Link>
            {product.stock > 0 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <ShoppingCartIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 relative z-10">
        {/* Category/Tag */}
        <div className="mb-2">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        {/* Title */}
        <Link
          href={`/products/${product.id}`}
          className="block"
        >
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 hover:text-purple-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon
              key={index}
              className={`h-4 w-4 ${index < rating ? 'text-yellow-400' : 'text-gray-600'}`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-400">
            {rating > 0 ? `(${rating.toFixed(1)})` : '(New)'}
          </span>
        </div>

        {/* Price and Stock */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              ${product.price.toFixed(2)}
            </span>
          </div>
          {product.stock > 0 ? (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
              In Stock
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30">
              Sold Out
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            product.stock > 0
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCartIcon className="h-5 w-5" />
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </motion.button>
      </div>

      {/* Shine effect on hover */}
      <div className={`absolute inset-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transition-all duration-700 ${isHovered ? 'left-full' : ''}`}></div>
    </motion.div>
  );
}
