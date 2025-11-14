// app/shop/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ShopCard from '@/components/ShopCard';
import { Filter } from 'lucide-react';

interface iPhone {
  _id: string;
  model: string;
  price: number;
  imageUrl: string;
  stock: number;
  isHot?: boolean;
}

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [products] = useState<iPhone[]>([
    { _id: '1', model: 'iPhone 16 Pro Max', price: 399999, imageUrl: '/api/placeholder/400/400', stock: 45, isHot: true },
    { _id: '2', model: 'iPhone 16 Pro', price: 349999, imageUrl: '/api/placeholder/400/400', stock: 8 },
    { _id: '3', model: 'iPhone 16', price: 299999, imageUrl: '/api/placeholder/400/400', stock: 120 },
    { _id: '4', model: 'iPhone 15 Pro', price: 279999, imageUrl: '/api/placeholder/400/400', stock: 30, isHot: true },
    { _id: '5', model: 'iPhone 15', price: 249999, imageUrl: '/api/placeholder/400/400', stock: 5 },
    { _id: '6', model: 'iPhone 14', price: 199999, imageUrl: '/api/placeholder/400/400', stock: 80 },
  ]);

  // Sync search from navbar
  useEffect(() => {
    const handleSearch = (e: any) => setSearchQuery(e.detail);
    window.addEventListener('navbarSearch', handleSearch);
    return () => window.removeEventListener('navbarSearch', handleSearch);
  }, []);

  const filtered = products.filter(p => {
    const matchesSearch = p.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'hot' && p.isHot) || 
      (filter === 'low' && p.stock < 20);
    return matchesSearch && matchesFilter;
  });

  const addToCart = (product: iPhone) => {
    const saved = localStorage.getItem('appleHomeCart');
    const cart = saved ? JSON.parse(saved) : [];
    const existing = cart.find((item: any) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('appleHomeCart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${product.model} added to cart!`);
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Hero */}
        <section className="relative h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7CB342]/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl md:text-8xl font-bold text-black mb-4">
                iPhone <span className="text-[#7CB342]">Shop</span>
              </h1>
              <p className="text-xl text-gray-700">Premium Apple Devices in Sri Lanka</p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 mt-12 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-6 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
              >
                <option value="all">All Products</option>
                <option value="hot">Hot Deals</option>
                <option value="low">Low Stock</option>
              </select>
            </div>
            <p className="text-gray-600">{filtered.length} products found</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((phone) => (
              <ShopCard key={phone._id} product={phone} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}