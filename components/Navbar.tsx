// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShoppingCart, Menu, X, Search, Phone, Mail, Truck, MapPin, Monitor, Smartphone, TabletSmartphone, Watch, Headphones, Cable, LifeBuoy, User, Loader2, Home, LayoutDashboard } from 'lucide-react';
import CartDrawer from './CartDrawer';
import { useCart } from '@/components/providers/CartProvider';

function NavigationEvents({ setNavigatingTo, setIsOpen }: { setNavigatingTo: (val: string | null) => void, setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setNavigatingTo(null);
    setIsOpen(false);
  }, [pathname, searchParams, setNavigatingTo, setIsOpen]);

  return null;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const { cartCount } = useCart();

  // Live Search States
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  const categories = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Used iPhones', icon: Smartphone, href: '/shop?condition=used' },
    { name: 'Brand New iPhones', icon: Smartphone, href: '/shop?condition=new' },
    { name: 'Earbuds', icon: Headphones, href: '/shop?category=earbuds' },
    { name: 'Watches', icon: Watch, href: '/shop?category=watches' },
    { name: 'Chargers & Accessories', icon: Cable, href: '/shop?category=accessories' }
  ];

  // Live Search Effect
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const fetchResults = async () => {
      setIsSearching(true);
      try {
        const res = await fetch('/api/iphones');
        if (res.ok) {
          const data = await res.json();
          const allProducts = Array.isArray(data) ? data : data.iphones || [];
          
          const searchLower = searchQuery.toLowerCase();
          const filtered = allProducts.filter((p: any) => 
            p.model.toLowerCase().includes(searchLower) || 
            (p.category && p.category.toLowerCase().includes(searchLower))
          ).slice(0, 5); // Limit to top 5 hits

          setSearchResults(filtered);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleNavClick = (e: React.MouseEvent, cat: any) => {
    e.preventDefault();
    setNavigatingTo(cat.name);
    // Let the loader render before navigating
    setTimeout(() => {
      router.push(cat.href);
    }, 50);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <Suspense fallback={null}>
        <NavigationEvents setNavigatingTo={setNavigatingTo} setIsOpen={setIsOpen} />
      </Suspense>
      {/* Top Black Bar */}
      <div className="bg-black text-white py-2 px-4 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-medium tracking-wide">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> +94 77 777 4514</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> support@applemall.lk</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/track" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"><Truck className="w-3.5 h-3.5" /> Track Your Order</Link>
            <Link href="/stores" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"><MapPin className="w-3.5 h-3.5" /> Store Locator</Link>
          </div>
        </div>
      </div>

      {/* Main Header Block */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-5">
        <div className="flex items-center justify-between gap-4 md:gap-8 flex-wrap">
          {/* Menu & Logo Group */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              {/* Monolithic Apple Home Text Logo */}
              <div className="flex flex-col transform tracking-tighter leading-none">
                <span className="text-3xl font-black text-black">APPLE</span>
                <span className="text-3xl font-black text-[#7CB342]">HOME</span>
              </div>
            </Link>
          </div>

          {/* Huge Search Bar */}
          <div className="order-last sm:order-none w-full sm:flex-1 max-w-3xl relative">
            <div className="relative flex items-center w-full z-20">
              <input
                type="text"
                placeholder="Search for Products"
                value={searchQuery}
                onFocus={() => { if(searchQuery.trim().length > 0) setShowDropdown(true); }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-14 py-3 bg-white border-2 border-[#7CB342] rounded-full text-base focus:outline-none focus:ring-4 focus:ring-[#7CB342]/20 transition-all font-medium text-gray-700"
              />
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('navbarSearch', { detail: searchQuery }));
                  router.push('/shop');
                }}
                className="absolute right-0 h-full px-5 bg-[#7CB342] text-white rounded-r-full hover:bg-[#689f38] transition-colors flex items-center justify-center">
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Live Search Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] animate-fade-in shadow-gray-200/50">
                {isSearching ? (
                  <div className="p-6 text-center flex flex-col items-center justify-center">
                    <Loader2 className="w-6 h-6 text-[#7CB342] animate-spin mb-2" />
                    <span className="text-sm font-medium text-gray-500">Searching inventory...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="flex flex-col max-h-[60vh] overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link 
                        key={product._id} 
                        href={`/shop/${product._id}`}
                        onClick={() => {
                          setSearchQuery('');
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                           <img src={product.imageUrl} alt={product.model} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-bold text-gray-900 line-clamp-1">{product.model}</p>
                          <p className="text-xs font-medium text-gray-400 mt-0.5">{product.category || 'Product'}</p>
                        </div>
                        <div className="font-bold text-[#7CB342] whitespace-nowrap">
                          LKR {(product.basePrice || product.price || 0)?.toLocaleString()}
                        </div>
                      </Link>
                    ))}
                    <Link
                      href="/shop"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('navbarSearch', { detail: searchQuery }));
                        setShowDropdown(false);
                      }}
                      className="p-3 text-center text-sm font-bold text-[#7CB342] bg-green-50/50 hover:bg-[#7CB342] hover:text-white transition-colors"
                    >
                      View all matching results
                    </Link>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Search className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium tracking-tight">No products found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions (Auth & Cart) */}
          <div className="flex items-center gap-4 sm:gap-6">
            {status === 'authenticated' ? (
              <>
                {(session?.user as any)?.role === 'admin' && (
                  <Link href="/admin/dashboard" title="Admin Dashboard" className="hidden lg:flex flex-col items-center text-gray-700 hover:text-[#7CB342] transition-colors">
                    <LayoutDashboard className="w-6 h-6" />
                  </Link>
                )}
                <Link href="/profile" title="My Profile" className="hidden lg:flex flex-col items-center text-[#7CB342] hover:text-[#689f38] transition-colors relative">
                  <User className="w-6 h-6" />
                  <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                </Link>
              </>
            ) : (
              <Link href="/login" title="Login / Register" className="hidden lg:flex flex-col items-center text-gray-700 hover:text-[#7CB342] transition-colors">
                <User className="w-6 h-6" />
              </Link>
            )}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-[#7CB342] transition-colors flex flex-col items-center"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Row (Desktop) */}
      <div className="hidden lg:block border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center justify-center gap-10">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={cat.href}
                onClick={(e) => handleNavClick(e, cat)}
                className="flex items-center gap-2 text-gray-600 hover:text-[#7CB342] transition-colors font-medium text-sm group cursor-pointer"
              >
                <cat.icon className="w-4 h-4 text-gray-500 group-hover:text-[#7CB342] transition-colors" />
                <span>{cat.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-xl max-h-[80vh] overflow-y-auto animate-fade-in">
          <div className="px-4 py-2">
            <nav className="space-y-1">
              {categories.map((cat) => (
                <a
                  key={cat.name}
                  href={cat.href}
                  onClick={(e) => handleNavClick(e, cat)}
                  className="flex items-center gap-3 px-3 py-4 text-gray-700 font-medium hover:bg-green-50 hover:text-[#7CB342] rounded-xl transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                >
                  <cat.icon className="w-5 h-5" />
                  {cat.name}
                </a>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-100 flex flex-col gap-1">
                 {status === 'authenticated' ? (
                   <>
                     <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-4 text-[#7CB342] font-medium hover:bg-green-50 rounded-xl transition-colors bg-green-50/50">
                       <User className="w-5 h-5" />
                       My Profile
                     </Link>
                     {(session?.user as any)?.role === 'admin' && (
                       <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-4 text-gray-700 font-medium hover:bg-green-50 hover:text-[#7CB342] rounded-xl transition-colors">
                         <LayoutDashboard className="w-5 h-5" />
                         Admin Dashboard
                       </Link>
                     )}
                   </>
                 ) : (
                   <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-4 text-gray-700 font-medium hover:bg-green-50 hover:text-[#7CB342] rounded-xl transition-colors">
                     <User className="w-5 h-5" />
                     Login / Account
                   </Link>
                 )}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Navigation Feedback Loader */}
      {navigatingTo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white px-8 py-6 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <Loader2 className="w-10 h-10 text-[#7CB342] animate-spin" />
            <p className="text-lg font-bold text-gray-900 tracking-tight">
              Loading {navigatingTo}...
            </p>
          </div>
        </div>
      )}
    </header>
  );
}