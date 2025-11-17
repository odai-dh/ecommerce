'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
    return (
      <section className="relative mb-16 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Subtle animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(14,165,233,0.3),rgba(6,182,212,0.1),transparent)]"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 text-center md:text-left z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full"
              >
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                <span className="text-cyan-300 text-sm font-medium">New Arrivals 2025</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
                Premium Quality
                <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 text-transparent bg-clip-text">
                  Exceptional Style
                </span>
              </h1>

              <p className="text-lg md:text-xl mb-10 text-slate-300 max-w-lg">
                Discover our curated collection of premium products. Elegance meets affordability.
              </p>

              <div className="flex gap-4 justify-center md:justify-start">
                <Link
                  href="/products"
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105"
                >
                  <span className="relative z-10">Explore Collection</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>

                <Link
                  href="/products"
                  className="px-8 py-4 border-2 border-cyan-500/50 text-cyan-300 font-semibold rounded-xl hover:bg-cyan-500/10 transition-all duration-300 hover:border-cyan-400"
                >
                  View Deals
                </Link>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto md:mx-0"
              >
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">10K+</div>
                  <div className="text-slate-400 text-sm mt-1">Customers</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">500+</div>
                  <div className="text-slate-400 text-sm mt-1">Products</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">4.9★</div>
                  <div className="text-slate-400 text-sm mt-1">Rating</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="md:w-1/2 relative z-10"
            >
              <div className="relative group">
                {/* Glow effect behind image */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

                <div className="relative aspect-square rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl">
                  <Image
                    src="/images/hero.jpg"
                    alt="Fashion Collection"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl px-6 py-4 shadow-xl"
                >
                  <div className="text-2xl font-bold">50% OFF</div>
                  <div className="text-xs opacity-90">Limited Time</div>
                </motion.div>

                {/* Trust badge */}
                <div className="absolute -bottom-4 -left-4 bg-slate-800/90 backdrop-blur-sm border border-cyan-500/30 rounded-xl px-6 py-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-white font-medium">Trusted by 10K+</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  );
}
