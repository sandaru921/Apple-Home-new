// app/shop/ShopClient.tsx
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';

type iPhone = {
  _id: string;
  model: string;
  price: number;
  imageUrl: string;
  colors: string[];
  storage: string[];
  description: string;
};

export default function ShopClient({ initialiPhones }: { initialiPhones: iPhone[] }) {
  const [iphones] = useState<iPhone[]>(initialiPhones);
  const [search, setSearch] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const allColors = Array.from(new Set(iphones.flatMap(p => p.colors)));
  const allStorage = Array.from(new Set(iphones.flatMap(p => p.storage)));
  const maxPrice = Math.max(...iphones.map(p => p.price), 1000000);

  const filtered = useMemo(() => {
    return iphones.filter(phone => {
      const matchesSearch = phone.model.toLowerCase().includes(search.toLowerCase());
      const matchesColor = selectedColors.length === 0 || phone.colors.some(c => selectedColors.includes(c));
      const matchesStorage = selectedStorage.length === 0 || phone.storage.some(s => selectedStorage.includes(s));
      const matchesPrice = phone.price >= priceRange[0] && phone.price <= priceRange[1];
      return matchesSearch && matchesColor && matchesStorage && matchesPrice;
    });
  }, [iphones, search, selectedColors, selectedStorage, priceRange]);

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-text-light dark:text-text-dark">
          iPhone Shop
        </h1>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search iPhone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <select
              multiple
              size={3}
              value={selectedColors}
              onChange={(e) => setSelectedColors(Array.from(e.target.selectedOptions, o => o.value))}
              className="px-4 py-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-sm"
            >
              {allColors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              multiple
              size={3}
              value={selectedStorage}
              onChange={(e) => setSelectedStorage(Array.from(e.target.selectedOptions, o => o.value))}
              className="px-4 py-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-sm"
            >
              {allStorage.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Price: LKR {priceRange[0].toLocaleString()} - LKR {priceRange[1].toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((phone) => (
            <div
              key={phone._id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative h-64">
                <Image
                  src={phone.imageUrl}
                  alt={phone.model}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                  {phone.model}
                </h3>
                <p className="text-2xl font-bold text-primary">
                  LKR {phone.price.toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-1 mt-2 text-xs text-gray-600 dark:text-gray-400">
                  {phone.colors.slice(0, 2).map(c => (
                    <span key={c} className="px-2 py-1 bg-primary/10 rounded-full">{c}</span>
                  ))}
                  {phone.colors.length > 2 && <span>+{phone.colors.length - 2}</span>}
                  <span className="mx-1">•</span>
                  {phone.storage.join(', ')}
                </div>
              </div>
              <div className="px-5 pb-5">
                <button className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-dark font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-20 text-gray-500">No iPhones found.</p>
        )}
      </div>
    </div>
  );
}