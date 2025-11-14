// app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import Countdown from '@/components/Countdown';

// TypeScript interfaces
interface FeaturedPhone {
  _id: string;
  model: string;
  price: number;
  imageUrl: string;
}

interface Offer {
  _id: string;
  discountPercent: number;
  endDate: string;
  iPhone: {
    _id: string;
    model: string;
    price: number;
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
  featured: FeaturedPhone[];
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [data, setData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for demonstration - replace with actual API calls
        const mockData: HomeData = {
          slides: [
            { _id: '1', imageUrl: '/api/placeholder/1200/600' },
            { _id: '2', imageUrl: '/api/placeholder/1200/600' },
            { _id: '3', imageUrl: '/api/placeholder/1200/600' },
          ],
          offers: [
            {
              _id: '1',
              discountPercent: 25,
              endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              iPhone: {
                _id: '1',
                model: 'iPhone 15 Pro',
                price: 299999,
                imageUrl: '/api/placeholder/300/300',
              },
            },
          ],
          featured: [
            { _id: '1', model: 'iPhone 15 Pro Max', price: 349999, imageUrl: '/api/placeholder/300/300' },
            { _id: '2', model: 'iPhone 15 Pro', price: 299999, imageUrl: '/api/placeholder/300/300' },
            { _id: '3', model: 'iPhone 15', price: 249999, imageUrl: '/api/placeholder/300/300' },
            { _id: '4', model: 'iPhone 14', price: 199999, imageUrl: '/api/placeholder/300/300' },
          ],
        };
        setData(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
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

  const { slides, offers, featured } = data || { slides: [], offers: [], featured: [] };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden relative">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(124,179,66,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(124,179,66,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Ambient Glow Effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#7CB342]/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-[#7CB342]/5 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="relative z-10">
        <Navbar />

      {/* Hero Section with Interactive Slideshow */}
      <section className="relative min-h-screen flex items-center justify-center py-20">
        {/* Subtle Background Effects */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-1/4 left-1/2 w-[600px] h-[600px] -translate-x-1/2 bg-[#7CB342]/10 rounded-full blur-3xl"
            style={{
              transform: `translate(calc(-50% + ${mousePosition.x}px), ${mousePosition.y}px)`,
              transition: 'transform 0.2s ease-out',
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <div className="mb-16">
            {/* Hero Logo */}
            <div className="relative inline-block mb-8">
              <div className="mb-6 flex justify-center">
                <Image src="/logo.png" alt="Apple Home" width={200} height={200} className="object-contain drop-shadow-2xl" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                <span className="text-black">APPLE </span>
                <span className="text-[#7CB342]">HOME</span>
              </h1>
              <p className="text-sm md:text-base text-gray-600 tracking-widest uppercase">
                Expert iPhone Sales & Repairs
              </p>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 font-light tracking-wide">
              Your Trusted Partner for Premium Apple Products
            </p>
            
            {/* CTA Button - Single, Prominent */}
            <div className="flex justify-center">
              <Link
                href="/shop"
                className="group relative px-12 py-5 bg-[#7CB342] text-white rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-[#6fa135]"
              >
                <span className="relative flex items-center gap-3">
                  <span>Explore Collection</span>
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Interactive Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {/* Latest Models Card */}
            <div className="group relative p-8 bg-white backdrop-blur-xl rounded-2xl border border-gray-200 overflow-hidden transition-all duration-500 hover:scale-105 hover:border-[#7CB342] hover:shadow-xl">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-[#7CB342]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon */}
              <div className="relative mb-6 w-14 h-14 flex items-center justify-center bg-[#7CB342]/10 rounded-xl border border-[#7CB342]/30 group-hover:border-[#7CB342] transition-all duration-300">
                <svg className="w-7 h-7 text-[#7CB342]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-900">Latest Models</h3>
              <p className="text-gray-600 leading-relaxed">Get the newest iPhone models with cutting-edge technology</p>
              
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#7CB342]/5 blur-2xl rounded-full"></div>
            </div>

            {/* Fast Delivery Card */}
            <div className="group relative p-8 bg-white backdrop-blur-xl rounded-2xl border border-gray-200 overflow-hidden transition-all duration-500 hover:scale-105 hover:border-[#7CB342] hover:shadow-xl">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-[#7CB342]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon */}
              <div className="relative mb-6 w-14 h-14 flex items-center justify-center bg-[#7CB342]/10 rounded-xl border border-[#7CB342]/30 group-hover:border-[#7CB342] transition-all duration-300">
                <svg className="w-7 h-7 text-[#7CB342]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-900">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Island-wide delivery within 24 hours</p>
              
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#7CB342]/5 blur-2xl rounded-full"></div>
            </div>

            {/* Premium Quality Card */}
            <div className="group relative p-8 bg-white backdrop-blur-xl rounded-2xl border border-gray-200 overflow-hidden transition-all duration-500 hover:scale-105 hover:border-[#7CB342] hover:shadow-xl">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-[#7CB342]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon */}
              <div className="relative mb-6 w-14 h-14 flex items-center justify-center bg-[#7CB342]/10 rounded-xl border border-[#7CB342]/30 group-hover:border-[#7CB342] transition-all duration-300">
                <svg className="w-7 h-7 text-[#7CB342]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-900">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">100% authentic products with warranty</p>
              
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#7CB342]/5 blur-2xl rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Special Offers Section */}
      {offers.length > 0 && (
        <section className="py-20 px-4 relative bg-gray-50">
          <div className="relative max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#7CB342]/10 border border-[#7CB342]/30 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-[#7CB342] rounded-full animate-pulse"></span>
              LIMITED TIME OFFER
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-[#7CB342]">
              {offers[0].discountPercent}% OFF
            </h2>
            <p className="text-2xl md:text-3xl mb-8 text-gray-900">
              {offers[0].iPhone.model}
            </p>
            <div className="mb-8">
              <Countdown endDate={offers[0].endDate} />
            </div>
            <Link
              href="/shop"
              className="inline-block px-12 py-4 bg-[#7CB342] text-white rounded-xl font-bold text-xl hover:scale-105 transition-all duration-300 hover:shadow-xl hover:bg-[#6fa135]"
            >
              Grab This Deal
            </Link>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block relative mb-6">
              <h2 className="text-5xl md:text-6xl font-bold">
                <span className="text-black">Featured </span>
                <span className="text-[#7CB342]">Collection</span>
              </h2>
            </div>
            <p className="text-xl text-gray-600 font-light">Discover our most popular iPhone models</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((phone: FeaturedPhone, index: number) => (
              <div
                key={phone._id}
                className="group relative bg-white backdrop-blur-xl rounded-2xl border border-gray-200 overflow-hidden hover:scale-105 transition-all duration-500 hover:border-[#7CB342] hover:shadow-xl"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#7CB342] to-transparent opacity-50"></div>
                
                <div className="relative p-6">
                  {/* Product Image */}
                  <div className="relative h-64 mb-6 rounded-xl overflow-hidden bg-gray-50">
                    <Image
                      src={phone.imageUrl}
                      alt={phone.model}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                    
                    {/* Corner Badge */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-[#7CB342]/20 rounded-lg backdrop-blur-sm border border-[#7CB342]/30"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#7CB342] transition-colors">
                      {phone.model}
                    </h3>
                    
                    {/* Price */}
                    <p className="text-3xl font-bold text-[#7CB342]">
                      LKR {phone.price.toLocaleString()}
                    </p>
                    
                    {/* CTA Button */}
                    <Link
                      href="/shop"
                      className="block w-full py-3 bg-[#7CB342] text-white rounded-xl text-center font-semibold transition-all duration-300 hover:shadow-lg hover:bg-[#6fa135]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 relative bg-gray-50">
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-black">Stay </span>
              <span className="text-[#7CB342]">Updated</span>
            </h2>
          </div>
          <p className="text-xl text-gray-600 mb-8 font-light">Get notified about new arrivals and exclusive offers</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#7CB342] focus:ring-2 focus:ring-[#7CB342]/20 transition-all"
            />
            <button className="px-8 py-4 bg-[#7CB342] text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 hover:shadow-xl hover:bg-[#6fa135]">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-black">APPLE </span>
                <span className="text-[#7CB342]">HOME</span>
              </h3>
              <p className="text-gray-600 font-light">Your trusted partner for premium Apple products in Sri Lanka</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Quick Links</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/shop" className="hover:text-[#7CB342] transition-colors">Shop</Link></li>
                <li><Link href="/about" className="hover:text-[#7CB342] transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-[#7CB342] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/warranty" className="hover:text-[#7CB342] transition-colors">Warranty</Link></li>
                <li><Link href="/shipping" className="hover:text-[#7CB342] transition-colors">Shipping</Link></li>
                <li><Link href="/returns" className="hover:text-[#7CB342] transition-colors">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-[#7CB342] rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-[#7CB342] rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
                  </svg>
                </a>
              </div>
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