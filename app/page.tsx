// app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import Countdown from '@/components/Countdown';
import { ShieldCheck, Truck, Lock, Wrench } from 'lucide-react';

// TypeScript interfaces
interface FeaturedPhone {
  _id: string;
  model: string;
  price?: number;
  basePrice?: number;
  imageUrl: string;
  stock: number;
}

interface Offer {
  _id: string;
  discountPercent: number;
  endDate: string;
  iPhoneId: {
    _id: string;
    model: string;
    price?: number;
    basePrice?: number;
    imageUrl: string;
  };
}

interface Slide {
  _id: string;
  imageUrl: string;
}

interface HomeData {
  slides: Slide[];
  offers: Offer[];
  newArrivals: FeaturedPhone[];
  onSale: FeaturedPhone[];
  topRated: FeaturedPhone[];
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'New Arrival' | 'On Sale' | 'Top Rated'>('New Arrival');
  const [data, setData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Slides
        const slidesRes = await fetch('/api/slides');
        const slides = slidesRes.ok ? await slidesRes.json() : [];

        // Fetch Featured Phones (iPhones that are marked featured)
        // Since we don't have a specific featured API yet, we'll fetch all and slice the first 4 for now
        const phonesRes = await fetch('/api/iphones');
        const allPhones = phonesRes.ok ? await phonesRes.json() : [];
        
        // Filter logic for tabs
        const newArrivals = allPhones.filter((p: any) => p.condition === 'New' || !p.condition).slice(0, 8);
        const onSaleItems = allPhones.filter((p: any) => p.price && p.basePrice && p.price < p.basePrice);
        const onSale = onSaleItems.length > 0 ? onSaleItems.slice(0, 8) : allPhones.slice(1, 9);
        const topRatedItems = allPhones.filter((p: any) => p.condition === 'Excellent').slice(0, 8);
        const topRated = topRatedItems.length > 0 ? topRatedItems : allPhones.slice(2, 10);

        // Fetch valid offers 
        const offersRes = await fetch('/api/offers');
        const offers = offersRes.ok ? await offersRes.json() : [];

        const pageData: HomeData = {
          slides: slides.length > 0 ? slides : [
            { _id: '1', imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg' } // Fallback image if DB is empty
          ],
          offers: offers,
          newArrivals,
          onSale,
          topRated,
        };
        
        setData(pageData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (!data?.slides?.length) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [data?.slides?.length]);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-400 rounded-full animate-ping"></div>
          <div className="absolute inset-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl"></div>
        </div>
      </div>
    );
  }

  const { slides, offers, newArrivals, onSale, topRated } = data || { slides: [], offers: [], newArrivals: [], onSale: [], topRated: [] };

  const getTabProducts = () => {
    if (activeTab === 'New Arrival') return newArrivals;
    if (activeTab === 'On Sale') return onSale;
    return topRated;
  };

  const displayProducts = getTabProducts();

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden relative">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(124,179,66,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(124,179,66,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Apple Minimalist Background Pattern */}
      <div className="fixed inset-0 bg-[#fbfbfd]"></div>
      
      <div className="relative z-10">
        <Navbar />

      {/* Containerized Hero Slider */}
      <section className="pt-[140px] md:pt-[170px] pb-10 px-4 max-w-7xl mx-auto relative z-10 w-full overflow-hidden">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden bg-gray-100 shadow-sm group">
          {slides.map((slide: Slide, index: number) => (
            <div
              key={slide._id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 z-[-1]'
              }`}
            >
              <Image
                src={slide.imageUrl}
                alt="Hero Slide"
                fill
                className="object-cover"
                unoptimized
                priority={index === 0}
              />
            </div>
          ))}

          {/* Fallback if no slides exist */}
          {slides.length === 0 && (
             <div className="absolute inset-0 bg-[#eef5fd] flex flex-col items-center justify-center text-black p-4 text-center">
                <h2 className="text-2xl md:text-4xl font-bold mb-2">Welcome to Apple Home</h2>
                <p>Premium Apple Products</p>
             </div>
          )}

          {/* Arrows - Larger touch targets for mobile */}
          <button 
            onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-10 md:h-10 bg-black/40 md:bg-black/10 md:hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow-lg"
          >
            <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          <button 
            onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-10 md:h-10 bg-black/40 md:bg-black/10 md:hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow-lg"
          >
            <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${idx === currentSlide ? 'bg-gray-800' : 'bg-gray-300 hover:bg-gray-400'}`}
            />
          ))}
        </div>
      </section>

      {/* Product Tabs & Grid */}
      <section className="pb-20 px-4 mt-6">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex justify-center gap-8 border-b border-gray-200 mb-10 relative">
            <button 
              onClick={() => setActiveTab('New Arrival')}
              className={`pb-3 text-lg font-bold transition-colors relative ${activeTab === 'New Arrival' ? 'text-gray-900 border-b-2 border-[#7CB342]' : 'text-gray-500 hover:text-gray-900'}`}
            >
              New Arrival
              {activeTab === 'New Arrival' && <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-[#7CB342]"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('On Sale')}
              className={`pb-3 text-lg font-bold transition-colors relative ${activeTab === 'On Sale' ? 'text-gray-900 border-b-2 border-[#7CB342]' : 'text-gray-500 hover:text-gray-900'}`}
            >
              On Sale
              {activeTab === 'On Sale' && <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-[#7CB342]"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('Top Rated')}
              className={`pb-3 text-lg font-bold transition-colors relative ${activeTab === 'Top Rated' ? 'text-gray-900 border-b-2 border-[#7CB342]' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Top Rated
              {activeTab === 'Top Rated' && <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-[#7CB342]"></div>}
            </button>
          </div>
          
          {/* Animated wrapper for product changes */}
          <div key={activeTab} className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth animate-fade-in">
            {displayProducts.map((phone: FeaturedPhone, index: number) => {
              const isOutOfStock = phone.stock <= 0;
              const isLowStock = phone.stock > 0 && phone.stock < 10;
              
              return (
                <Link
                  href={`/shop/${phone._id}`}
                  key={phone._id}
                  className="group relative bg-white border border-gray-100 overflow-hidden hover:shadow-xl hover:border-transparent transition-all duration-300 flex flex-col h-full rounded-xl shrink-0 w-[85vw] sm:w-auto snap-center"
                >
                  {/* Stock Badges */}
                  {isOutOfStock ? (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gray-500 text-white rounded-full text-xs font-bold shadow-sm">
                      Out of Stock
                    </div>
                  ) : isLowStock ? (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold shadow-sm">
                      Only {phone.stock} left
                    </div>
                  ) : null}

                  <div className="relative p-5 sm:p-6 bg-white h-full flex flex-col justify-between">
                    {/* Category text */}
                    <div className="text-left mb-2">
                      <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Product</span>
                    </div>

                    {/* Product Title matched to vivid blue text */}
                    <h3 className="text-[1.1rem] font-bold text-gray-900 leading-snug mb-5 sm:mb-6 group-hover:text-[#7CB342] transition-colors text-left flex-1 border-b border-transparent">
                      {phone.model}
                    </h3>

                    {/* Product Image */}
                    <div className="relative h-48 sm:h-56 mb-4 w-full bg-white flex items-center justify-center p-2 rounded-xl">
                      <Image
                        src={phone.imageUrl}
                        alt={phone.model}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    </div>
                    
                    <div className="text-left mt-auto">
                      {/* Price */}
                      <p className="text-xl sm:text-2xl font-black text-gray-900">
                        LKR {(phone.basePrice || phone.price || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      {offers.length > 0 && (
        <section className="py-24 px-4 relative overflow-hidden bg-white mt-10">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#7CB342]/10 via-transparent to-[#7CB342]/10 bg-[length:200%_auto] animate-[gradient_8s_linear_infinite]"></div>
          
          {/* Glass Overlay Pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 MixBlendMode-overlay"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            {/* Pulsing Badge */}
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 bg-[#7CB342]/10 backdrop-blur-md border border-[#7CB342]/30 rounded-full text-xs sm:text-sm font-bold text-[#7CB342] mb-6 sm:mb-8 shadow-sm">
              <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7CB342] opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-[#7CB342]"></span>
              </span>
              FLASH SALE ENDING SOON
            </div>
            
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-black mb-2 sm:mb-4 text-[#7CB342] drop-shadow-sm leading-tight">
              {offers[0].discountPercent}% OFF
            </h2>
            <p className="text-2xl sm:text-3xl md:text-5xl mb-8 sm:mb-12 text-gray-800 font-light tracking-wide px-4">
              {offers[0].iPhoneId?.model}
            </p>
            
            {/* High-Contrast Countdown Panel */}
            <div className="mb-10 sm:mb-12 inline-block w-[95%] max-w-lg p-4 sm:p-6 bg-white/80 backdrop-blur-lg rounded-3xl border border-gray-100 shadow-xl">
              <Countdown endDate={offers[0].endDate} />
            </div>
            
            <div className="px-4">
              <Link
                href={`/shop/${offers[0].iPhoneId._id}?offer=${offers[0]._id}`}
                className="inline-block w-full sm:w-auto px-8 sm:px-14 py-4 sm:py-5 bg-[#7CB342] text-white rounded-full font-bold text-lg sm:text-xl uppercase tracking-wider hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-[#7CB342]/40"
              >
                Claim Offer Now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Trust Signals Section */}
      <section className="py-16 px-4 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-0 md:divide-x divide-gray-100">
          <div className="p-4 sm:p-6 md:py-0 flex flex-col items-center text-center group bg-gray-50 rounded-2xl md:bg-transparent md:rounded-none">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#7CB342]/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-[#7CB342] group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">12-Month Warranty</h3>
            <p className="text-gray-500 text-xs sm:text-sm">Comprehensive coverage on all pristine devices.</p>
          </div>
          <div className="p-4 sm:p-6 md:py-0 flex flex-col items-center text-center group bg-gray-50 rounded-2xl md:bg-transparent md:rounded-none">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#7CB342]/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-[#7CB342] group-hover:scale-110 transition-transform duration-300">
              <Wrench className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Certified Technicians</h3>
            <p className="text-gray-500 text-xs sm:text-sm">Every device undergoes a 40-point inspection.</p>
          </div>
          <div className="p-4 sm:p-6 md:py-0 flex flex-col items-center text-center group bg-gray-50 rounded-2xl md:bg-transparent md:rounded-none">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#7CB342]/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-[#7CB342] group-hover:scale-110 transition-transform duration-300">
              <Truck className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Free Fast Shipping</h3>
            <p className="text-gray-500 text-xs sm:text-sm">Island-wide secure delivery, tracked entirely.</p>
          </div>
          <div className="p-4 sm:p-6 md:py-0 flex flex-col items-center text-center group bg-gray-50 rounded-2xl md:bg-transparent md:rounded-none">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#7CB342]/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-[#7CB342] group-hover:scale-110 transition-transform duration-300">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Secure Checkout</h3>
            <p className="text-gray-500 text-xs sm:text-sm">Encrypted transactions via card and banks.</p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 relative bg-[#f5f5f7]">
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-4">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
              Stay Updated.
            </h2>
          </div>
          <p className="text-lg text-gray-500 mb-8 font-normal">Get notified about new arrivals and exclusive Apple Home offers.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#7CB342] focus:ring-1 focus:ring-[#7CB342] transition-all"
            />
            <button className="px-8 py-4 bg-[#7CB342] text-white rounded-full font-medium hover:scale-105 transition-all duration-300 shadow-sm">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            
            <div className="lg:col-span-2">
              <div className="flex flex-col transform tracking-tighter leading-none mb-6">
                <span className="text-3xl font-black text-black">APPLE</span>
                <span className="text-3xl font-black text-[#7CB342]">HOME</span>
              </div>
              <p className="text-gray-500 font-normal leading-relaxed mb-6 max-w-sm">
                Your premier destination for new and certified pristine Apple hardware in Sri Lanka.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#7CB342] hover:text-white transition-colors text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#7CB342] hover:text-white transition-colors text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-gray-900 tracking-wide uppercase text-sm">Shop</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><Link href="/shop" className="hover:text-[#7CB342] transition-colors">New iPhones</Link></li>
                <li><Link href="/shop" className="hover:text-[#7CB342] transition-colors">Premium Used</Link></li>
                <li><Link href="/shop" className="hover:text-[#7CB342] transition-colors">MacBooks</Link></li>
                <li><Link href="/shop" className="hover:text-[#7CB342] transition-colors">MagSafe Accessories</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-gray-900 tracking-wide uppercase text-sm">Support</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><Link href="/shipping" className="hover:text-[#7CB342] transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-[#7CB342] transition-colors">Returns Policy</Link></li>
                <li><Link href="/warranty" className="hover:text-[#7CB342] transition-colors">Warranty Details</Link></li>
                <li><Link href="/contact" className="hover:text-[#7CB342] transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-gray-900 tracking-wide uppercase text-sm">Legal & About</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><Link href="/story" className="hover:text-[#7CB342] transition-colors">Our Story</Link></li>
                <li><Link href="/guarantee" className="hover:text-[#7CB342] transition-colors">Trust Guarantee</Link></li>
                <li><Link href="/privacy" className="hover:text-[#7CB342] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#7CB342] transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

          </div>
          <div className="text-center pt-8 border-t border-gray-200 text-gray-600">
            <p className="font-light">© 2025 Apple Home LK. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}