"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CartIcon from '../cart/CartIcon';
import CartModal from '../cart/CartModal';
import { getUserFromToken } from '../../../hooks/useAuth';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loggedInUser = getUserFromToken();
    setUser(loggedInUser);

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
        ? 'bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-cyan-500/5'
        : 'bg-slate-900/80 backdrop-blur-md'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
            </div>
            <span className="text-2xl font-bold text-white">
              Sellby
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="relative text-sm font-medium text-slate-300 hover:text-white transition-colors group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/products?category=electronics"
              className="relative text-sm font-medium text-slate-300 hover:text-white transition-colors group"
            >
              Electronics
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/products?category=clothing"
              className="relative text-sm font-medium text-slate-300 hover:text-white transition-colors group"
            >
              Fashion
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
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
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                aria-label="Account Menu"
              >
                <UserCircleIcon className="h-5 w-5 text-cyan-400" />
                {user && (
                  <span className="hidden sm:block text-sm font-medium text-white">
                    Account
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {isAccountDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-xl border border-slate-700 overflow-hidden"
                  >
                    {user ? (
                      <div className="p-2">
                        <div className="px-4 py-3 border-b border-slate-700">
                          <p className="text-xs text-slate-400">Signed in as</p>
                          <p className="text-sm font-semibold text-white truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          href="/auth/profile"
                          className="flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-cyan-500/10 rounded-lg transition-colors mt-2"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          <UserCircleIcon className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          href="/auth/orders"
                          className="flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-cyan-500/10 rounded-lg transition-colors"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          📦 My Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-2"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    ) : (
                      <div className="p-2">
                        <Link
                          href="/auth/login"
                          className="block px-4 py-3 text-sm text-white hover:bg-cyan-500/10 rounded-lg transition-colors"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          href="/auth/register"
                          className="block px-4 py-3 text-sm text-white hover:bg-cyan-500/10 rounded-lg transition-colors"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          Register
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
              className="relative px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg shadow-lg shadow-cyan-500/30 transition-all"
            >
              <CartIcon />
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-700 py-4"
            >
              <Link
                href="/products"
                className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/products?category=electronics"
                className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Electronics
              </Link>
              <Link
                href="/products?category=clothing"
                className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fashion
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
      </AnimatePresence>
    </header>
  );
}
