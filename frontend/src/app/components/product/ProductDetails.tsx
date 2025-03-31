
"use client";

import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import ImageGallery from './ImageGallery';

export default function ProductDetails({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const rating = product.rating ?? 0; // Provide a default value of 0 if rating is undefined

  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ImageGallery images={[product.image]} />
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        
        <div className="text-2xl font-semibold">
          ${product.price.toFixed(2)}
        </div>

        {product.rating && (
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600">
              ({rating.toFixed(1)}/5.0)
            </span>
          </div>
        )}

        <p className="text-gray-600">{product.description}</p>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1,
            })}
            disabled={product.stock === 0}
            className={`px-6 py-3 btn rounded-md ${
              product.stock > 0
                ? 'bg-primary hover:bg-primary-dark text-white'
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
            }`}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <span className="text-sm text-gray-500">
            {product.stock} items left
          </span>
        </div>
      </div>
    </div>
  );
}