// app/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartItem {
  _id: string;
  model: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('appleHomeCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('appleHomeCart', JSON.stringify(cart));
    }
  }, [cart, isLoading]);

  // Update quantity
  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev.map(item =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // Remove item
  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 1500;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#7CB342]/30 border-t-[#7CB342] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Ambient Glow */}
        <div className="fixed top-20 left-1/4 w-96 h-96 bg-[#7CB342]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-[#7CB342]/5 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="text-black">Your </span>
              <span className="text-[#7CB342]">Cart</span>
            </h1>
            <p className="text-xl text-gray-600">Review your selected iPhones</p>
          </div>

          {cart.length === 0 ? (
            // EMPTY STATE
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full mb-8">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any iPhones yet.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#7CB342] text-white rounded-xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* CART ITEMS */}
              <div className="lg:col-span-2 space-y-6">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 border">
                        <Image
                          src={item.imageUrl}
                          alt={item.model}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.model}</h3>
                        <p className="text-2xl font-bold text-[#7CB342] mb-4">
                          LKR {(item.price * item.quantity).toLocaleString()}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-3 bg-red-50 rounded-xl hover:bg-red-100 transition self-start"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ORDER SUMMARY */}
              <div className="lg:col-span-1">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8 sticky top-28">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">LKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600' : 'font-semibold'}>
                        {shipping === 0 ? 'FREE' : `LKR ${shipping.toLocaleString()}`}
                      </span>
                    </div>
                    {shipping === 0 && (
                      <p className="text-sm text-green-600">Free shipping on orders over LKR 50,000!</p>
                    )}
                    <div className="h-px bg-gray-200"></div>
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-[#7CB342]">LKR {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-3 py-5 bg-[#7CB342] text-white rounded-xl font-bold text-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    href="/shop"
                    className="block text-center mt-4 text-[#7CB342] font-medium hover:underline"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}