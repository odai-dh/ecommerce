"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CartIcon from '../cart/CartIcon';
import CartModal from '../cart/CartModal';
import { getUserFromToken } from '../../../hooks/useAuth';
import { UserCircleIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const loggedInUser = getUserFromToken();
    setUser(loggedInUser);

    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-base-100/80 backdrop-blur-xl shadow-lg'
        : 'bg-base-100/50 backdrop-blur-md'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-lg">
                <ShoppingBagIcon className="h-6 w-6" />
              </div>
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Sellby
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="relative text-sm font-semibold text-white hover:text-purple-400 transition-colors group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/products?category=electronics"
              className="relative text-sm font-semibold text-white hover:text-purple-400 transition-colors group"
            >
              Electronics
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/products?category=clothing"
              className="relative text-sm font-semibold text-white hover:text-purple-400 transition-colors group"
            >
              Fashion
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Account Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-base-200 hover:bg-base-300 rounded-xl transition-colors"
                aria-label="Account Menu"
              >
                <UserCircleIcon className="h-6 w-6 text-purple-400" />
                {user && (
                  <span className="hidden sm:block text-sm font-medium text-white">
                    Account
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {isAccountDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-base-200/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                    style={{ zIndex: 50 }}
                  >
                    {user ? (
                      <div className="p-2">
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-xs text-gray-400">Signed in as</p>
                          <p className="text-sm font-semibold text-white truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          href="/auth/profile"
                          className="flex items-center px-4 py-3 text-sm text-white hover:bg-purple-600/20 rounded-xl transition-colors mt-2"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          👤 Profile
                        </Link>
                        <Link
                          href="/auth/orders"
                          className="flex items-center px-4 py-3 text-sm text-white hover:bg-purple-600/20 rounded-xl transition-colors"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          📦 My Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-4 py-3 text-sm text-red-400 hover:bg-red-600/20 rounded-xl transition-colors mt-2"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    ) : (
                      <div className="p-2">
                        <Link
                          href="/auth/login"
                          className="flex items-center px-4 py-3 text-sm text-white hover:bg-purple-600/20 rounded-xl transition-colors"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          🔐 Login
                        </Link>
                        <Link
                          href="/auth/register"
                          className="flex items-center px-4 py-3 text-sm text-white hover:bg-purple-600/20 rounded-xl transition-colors"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          ✨ Register
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg transition-all"
            >
              <CartIcon />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
      </AnimatePresence>
    </header>
  );
}
