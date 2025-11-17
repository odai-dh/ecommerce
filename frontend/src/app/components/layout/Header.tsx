"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CartIcon from '../cart/CartIcon';
import CartModal from '../cart/CartModal';
import { getUserFromToken } from '../../../hooks/useAuth';
import { VscAccount } from "react-icons/vsc";



export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const loggedInUser = getUserFromToken(); // Decode the token to get user info
    setUser(loggedInUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    setUser(null); // Clear user state
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl btn-ghost font-bold text-black">
            Sellby
          </Link>

          {/* Navigation and Cart */}
          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className="hidden sm:block text-sm font-medium text-black hover:text-gray-400"
            >
              Products
            </Link>

            
            {/* Account Dropdown */}
            <div className="dropdown dropdown-end">
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Account Menu"
              >
                <VscAccount className="text-black text-xl" />
              </button>
              {isAccountDropdownOpen && (
                <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                style={{ zIndex: 50, minWidth: '100%' }}
                >
                  {user ? (
                    <>
                      <li>
                        <Link href="/auth/profile">Profile</Link>
                      </li>
                      <li>
                        <Link href="/auth/orders">My Orders</Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="text-red-500">
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link href="/auth/login">Login</Link>
                      </li>
                      <li>
                        <Link href="/auth/register">Register</Link>
                      </li>
                    </>
                  )}
                </ul>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* <Link
                href="/cart"
                className="hidden sm:block text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                View Cart
              </Link> */}

              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <CartIcon />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Modal */}
      {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
    </header>
  );
}