// app/shop/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ShopCard from '@/components/ShopCard';
import { Filter } from 'lucide-react';

interface iPhone {
  _id: string;
  category?: string;
  model: string;
  price: number;
  imageUrl: string;
  stock: number;
  condition?: string;
  colors?: string[];
  storage?: string[];
  isHot?: boolean;
}

const CONDITIONS = ['New', 'Pristine (Used)', 'Excellent (Used)', 'Good (Used)'];

function ShopContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [products, setProducts] = useState<iPhone[]>([]);
  const [loading, setLoading] = useState(true);

  // Advanced Filters
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000000 });
  const [sortOption, setSortOption] = useState('newest');

  const searchParams = useSearchParams();

  useEffect(() => {
    const cond = searchParams.get('condition');
    const cat = searchParams.get('category');

    if (cond === 'new') {
      setSelectedConditions(['New']);
    } else if (cond === 'used') {
      setSelectedConditions(['Pristine (Used)', 'Excellent (Used)', 'Good (Used)']);
    } else {
      setSelectedConditions([]);
    }

    if (cat) {
      setSearchQuery(cat);
    } else {
      setSearchQuery('');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/iphones');
        if (res.ok) {
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : (data.iphones || []));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Sync search from navbar
  useEffect(() => {
    const handleSearch = (e: any) => setSearchQuery(e.detail);
    window.addEventListener('navbarSearch', handleSearch);
    return () => window.removeEventListener('navbarSearch', handleSearch);
  }, []);

  // Dynamic Filter Options
  const availableColors = Array.from(new Set(products.flatMap(p => p.colors || []))).filter(Boolean);
  const availableStorage = Array.from(new Set(products.flatMap(p => p.storage || []))).filter(Boolean);

  const toggleArrayItem = (item: string, current: string[], setter: (val: string[]) => void) => {
    if (current.includes(item)) setter(current.filter(i => i !== item));
    else setter([...current, item]);
  };

  const filtered = products.filter(p => {
    const searchLower = searchQuery.toLowerCase();
    
    // 1. Search Match: Checks Model Name, or exact Category match if requested by Navbar
    const matchesSearch = 
      searchQuery === '' ||
      p.model.toLowerCase().includes(searchLower) || 
      (p.category && p.category.toLowerCase().includes(searchLower));
    
    // 2. Hot/Low Match
    const matchesHotLow = filter === 'all' || 
      (filter === 'hot' && p.isHot) || 
      (filter === 'low' && p.stock < 20);

    // 3. Condition Match
    // If user selects specific conditions (e.g. "Used"), only show items that strictly match those.
    // If no conditions selected, show everything. "Brand New iPhones" lack a condition string, so handle them inherently.
    const matchesCondition = selectedConditions.length === 0 || 
      (p.condition 
        ? selectedConditions.includes(p.condition) 
        : (selectedConditions.includes('New') && p.category === 'Brand New iPhones'));

    // 4. Color & Storage
    const matchesColor = selectedColors.length === 0 || 
      (p.colors && p.colors.some(c => selectedColors.includes(c)));

    const matchesStorage = selectedStorage.length === 0 || 
      (p.storage && p.storage.some(s => selectedStorage.includes(s)));

    // 5. Price Base
    const matchesPrice = p.price >= priceRange.min && p.price <= priceRange.max;

    return matchesSearch && matchesHotLow && matchesCondition && matchesColor && matchesStorage && matchesPrice;
  }).sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    return 0; // 'newest' placeholder
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

        <div className="max-w-7xl mx-auto px-4 mt-12 mb-20 flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 shrink-0 space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#7CB342]" /> Filters
              </h3>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7CB342] mb-6"
              >
                <option value="all">All Inventory</option>
                <option value="hot">Hot Deals</option>
                <option value="low">Low Stock</option>
              </select>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-bold mb-4 text-gray-900">Price Range (LKR)</h4>
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={e => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#7CB342]"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={e => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#7CB342]"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-bold mb-4 text-gray-900">Condition</h4>
              <div className="space-y-3">
                {CONDITIONS.map(c => (
                  <label key={c} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedConditions.includes(c)}
                      onChange={() => toggleArrayItem(c, selectedConditions, setSelectedConditions)}
                      className="w-4 h-4 text-[#7CB342] rounded border-gray-300 focus:ring-[#7CB342]"
                    />
                    <span className="text-sm text-gray-700">{c}</span>
                  </label>
                ))}
              </div>
            </div>

            {availableStorage.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-bold mb-4 text-gray-900">Storage</h4>
                <div className="flex flex-wrap gap-2">
                  {availableStorage.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleArrayItem(s, selectedStorage, setSelectedStorage)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        selectedStorage.includes(s)
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableColors.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-bold mb-4 text-gray-900">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map(c => (
                    <button
                      key={c}
                      onClick={() => toggleArrayItem(c, selectedColors, setSelectedColors)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        selectedColors.includes(c)
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-600 font-medium">{filtered.length} products found</p>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse h-80 border border-gray-100"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((phone) => (
                  <ShopCard key={phone._id} product={phone} onAddToCart={addToCart} />
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full py-32 text-center flex flex-col items-center justify-center">
                    <Filter className="w-16 h-16 text-gray-200 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found</h3>
                    <p className="text-gray-500 max-w-sm">Try adjusting your filters or search query to find what you're looking for.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7CB342] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}