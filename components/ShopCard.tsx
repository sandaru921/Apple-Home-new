// components/ShopCard.tsx
'use client';

import Image from 'next/image';
import { ShoppingCart, Zap } from 'lucide-react';
import { useState } from 'react';

interface Props {
  product: {
    _id: string;
    model: string;
    price: number;
    imageUrl: string;
    stock: number;
    isHot?: boolean;
  };
  onAddToCart: (product: any) => void;
}

export default function ShopCard({ product, onAddToCart }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-12px)' : 'translateY(0)',
        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      {/* Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7CB342]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Hot Badge */}
      {product.isHot && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
          <Zap className="w-3 h-3" />
          HOT
        </div>
      )}

      {/* Low Stock */}
      {product.stock < 10 && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold">
          Only {product.stock} left!
        </div>
      )}

      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.model}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.model}</h3>
        <p className="text-3xl font-bold text-[#7CB342] mb-4">LKR {product.price.toLocaleString()}</p>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#7CB342] text-white rounded-xl font-bold hover:bg-[#6fa135] transition-all duration-300 group-hover:shadow-lg"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
      </div>

      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#7CB342]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
}