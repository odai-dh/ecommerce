'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
    return (
      <section className="relative mb-16 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 opacity-90">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        </div>

        {/* Animated blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 text-center md:text-left z-10"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold"
              >
                ✨ New Collection 2025
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight">
                Discover Your
                <span className="block bg-gradient-to-r from-yellow-200 to-pink-200 text-transparent bg-clip-text">
                  Perfect Style
                </span>
              </h1>

              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-lg">
                Explore our premium collection of products curated just for you. Quality meets style.
              </p>

              <div className="flex gap-4 justify-center md:justify-start">
                <Link
                  href="/products"
                  className="group relative px-8 py-4 bg-white text-purple-600 font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <span className="relative z-10">Shop Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    Shop Now →
                  </span>
                </Link>

                <Link
                  href="/products"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full border-2 border-white/50 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  View Deals
                </Link>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-12 flex gap-8 justify-center md:justify-start"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-white/80 text-sm">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-white/80 text-sm">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">4.9★</div>
                  <div className="text-white/80 text-sm">Rating</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="md:w-1/2 relative z-10"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 z-10"></div>
                <Image
                  src="/images/hero.jpg"
                  alt="Fashion Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute top-8 right-8 bg-white rounded-full px-6 py-3 shadow-lg z-20"
                >
                  <div className="text-2xl font-bold text-purple-600">50% OFF</div>
                  <div className="text-xs text-gray-600">Limited Time</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  );
}
