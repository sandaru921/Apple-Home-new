// components/NewSaleNotification.tsx
'use client';

import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

export default function NewSaleNotification() {
  const [show, setShow] = useState(false);

  // Simulate new sale
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 max-w-sm">
        <div className="w-12 h-12 bg-[#7CB342]/10 rounded-xl flex items-center justify-center">
          <Bell className="w-6 h-6 text-[#7CB342] animate-pulse" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900">New Sale!</p>
          <p className="text-sm text-gray-600">Receipt #1005 • LKR 299,999</p>
        </div>
        <button
          onClick={() => setShow(false)}
          className="p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}