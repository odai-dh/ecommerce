'use client';

import { useCart } from '@/context/CartContext';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

export default function CheckoutForm({ total }: { total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);
  
    try {
      // Call the API route to create the payment intent
      const response = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total * 100, // Convert to cents
          currency: 'usd',
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create payment intent');
      }
  
      const { paymentIntent } = result;
  
      // Confirm card payment
      const { error: confirmError } = await stripe.confirmCardPayment(
        paymentIntent.client_secret!,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: data.name,
              email: data.email,
              address: {
                line1: data.address,
                city: data.city,
                postal_code: data.postalCode,
                country: data.country,
              },
            },
          }
        }
      );
  
      if (confirmError) {
        throw new Error(confirmError.message);
      }

      // Create order in the database
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/orders`,
            {
              items: cartItems.map(item => ({
                productId: item.id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
              })),
              shippingAddress: data,
              paymentIntentId: paymentIntent.id,
              totalPrice: total,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          toast.success('Order placed successfully!');
        } catch (orderError) {
          console.error('Error creating order:', orderError);
          // Don't fail the checkout if order creation fails
          toast.warning('Payment succeeded but failed to save order. Please contact support.');
        }
      }

      // Clear cart on success
      clearCart();
      window.location.href = '/checkout/success';
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during payment');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow">
      <div className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            {...register('name')}
            className="w-full px-3 py-2 border bg-white text-black rounded-md"
            disabled={loading}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border bg-white text-black rounded-md"
            disabled={loading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Address Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            {...register('address')}
            className="w-full px-3 py-2 border bg-white text-black rounded-md"
            disabled={loading}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              {...register('city')}
              className="w-full px-3 py-2 border bg-white text-black rounded-md"
              disabled={loading}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          {/* Postal Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              {...register('postalCode')}
              className="w-full px-3 py-2 border bg-white text-black rounded-md"
              disabled={loading}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.postalCode.message}
              </p>
            )}
          </div>
        </div>

        {/* Country Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            {...register('country')}
            className="w-full px-3 py-2 border bg-white text-black rounded-md"
            disabled={loading}
          />
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
          )}
        </div>

        {/* Stripe Card Element */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Details
          </label>
          <div className="p-2 border rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-primary text-white border py-3 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Test using Stripe&apos;s demo card: 4242 4242 4242 4242
        </p>

        <p className="text-sm text-gray-500 text-center">
          By clicking &quot;Pay&quot;, you agree to our{' '}
          <Link href="/terms" className="text-primary link link-neutral">
            Terms of Service
          </Link>
        </p>
      </div>
    </form>
  );
}