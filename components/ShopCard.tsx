// components/ShopCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Zap } from 'lucide-react';

interface Props {
  product: {
    _id: string;
    model: string;
    price?: number;
    basePrice?: number;
    imageUrl: string;
    stock: number;
    isHot?: boolean;
    condition?: string;
  };
  onAddToCart: (product: any) => void;
}

export default function ShopCard({ product, onAddToCart }: Props) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  return (
    <div className="group relative bg-white border border-gray-100 overflow-hidden hover:shadow-xl hover:border-transparent transition-all duration-300 flex flex-col h-full rounded-xl">
      {/* Hot Badge */}
      {product.isHot && !isOutOfStock && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
          <Zap className="w-3 h-3" />
          HOT
        </div>
      )}

      {/* Stock Badges */}
      {isOutOfStock ? (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gray-500 text-white rounded-full text-xs font-bold">
          Out of Stock
        </div>
      ) : isLowStock ? (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold">
          Only {product.stock} left
        </div>
      ) : null}

      <div className="relative p-6 bg-white flex-1 flex flex-col">
        {/* Category text & Condition */}
        <div className="text-left mb-2 flex justify-between items-center">
          <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Product</span>
          {product.condition && product.condition !== 'New' && (
            <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
              {product.condition}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-[1.1rem] font-bold text-gray-900 leading-snug mb-6 group-hover:text-[#7CB342] transition-colors text-left flex-1">
          {product.model}
        </h3>

        {/* Product Image */}
        <div className="relative h-56 mb-4 w-full bg-white flex items-center justify-center p-2">
          <Image
            src={product.imageUrl}
            alt={product.model}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        </div>
        
        <div className="text-left mt-auto">
          {/* Price */}
          <p className="text-xl font-bold text-gray-900 mb-4">
            LKR {(product.basePrice || product.price || 0)?.toLocaleString()}
          </p>
          
          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/shop/${product._id}`}
              className="flex-1 flex items-center justify-center py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 text-sm"
            >
              Details
            </Link>
            <button
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className={`flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 text-sm ${
                isOutOfStock 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#7CB342] text-white hover:bg-[#6fa135] shadow-lg hover:shadow-[#7CB342]/40'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}