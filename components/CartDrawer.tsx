// components/CartDrawer.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOverlay } from '@/components/providers/OverlayProvider';
import { useCart } from '@/components/providers/CartProvider';

interface CartItem {
  _id: string;
  cartItemId?: string;
  model: string;
  price: number;
  imageUrl: string;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, isLoaded } = useCart();
  const { showConfirm } = useOverlay();

  const handleRemove = (idToRemove: string, itemName: string) => {
    showConfirm({
      title: 'Remove Item',
      message: `Are you sure you want to remove ${itemName} from your cart?`,
      confirmText: 'Remove',
      isDestructive: true,
      onConfirm: () => removeFromCart(idToRemove)
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isLoaded) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[100vw] sm:max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#7CB342]" />
            Your Cart
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
              <ShoppingBag className="w-16 h-16 text-gray-300" />
              <p className="text-xl font-medium text-gray-800">Your cart is empty</p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-900 font-medium transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const itemKey = item.cartItemId || item._id;
              return (
                <div key={itemKey} className="flex gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 relative group">
                  <div className="relative w-24 h-24 bg-white rounded-xl border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-2">
                    <Image
                      src={item.imageUrl}
                      alt={item.model}
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-gray-900 leading-tight">{item.model}</h3>
                      <button 
                        onClick={() => handleRemove(itemKey, item.model)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {(item.selectedStorage || item.selectedColor) && (
                      <div className="flex gap-2 mt-1">
                        {item.selectedStorage && <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">{item.selectedStorage}</span>}
                        {item.selectedColor && <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">{item.selectedColor}</span>}
                      </div>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1">
                        <button onClick={() => updateQuantity(itemKey, -1)} className="p-1 hover:bg-gray-100 rounded-md transition"><Minus className="w-3 h-3 text-gray-600" /></button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(itemKey, 1)} className="p-1 hover:bg-gray-100 rounded-md transition"><Plus className="w-3 h-3 text-gray-600" /></button>
                      </div>
                      <span className="font-bold text-[#7CB342]">
                        LKR {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-white shrink-0">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-gray-900">LKR {(subtotal || 0).toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-500 mb-6 text-center">Shipping & taxes calculated at checkout.</p>
            <button
              onClick={() => {
                onClose();
                router.push('/checkout');
              }}
              className="w-full py-4 bg-[#7CB342] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#7CB342]/30 hover:scale-[1.02] transition-all flex justify-center items-center gap-2"
            >
              Checkout <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                onClose();
                router.push('/cart');
              }}
              className="w-full mt-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              View Full Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
