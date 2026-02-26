// app/shop/[id]/page.tsx
'use client';

import { useState, useEffect, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { ShoppingCart, ArrowLeft, Loader2, Check, Zap, ChevronDown, ChevronUp, ShieldCheck, Battery } from 'lucide-react';
import Link from 'next/link';
import { useOverlay } from '@/components/providers/OverlayProvider';
import { useCart } from '@/components/providers/CartProvider';

interface Product {
  _id: string;
  category?: string;
  model: string;
  price?: number;
  basePrice?: number;
  stock: number;
  colors?: string[];
  storageOptions?: { capacity: string; price: number }[];
  condition?: string;
  batteryHealth?: number;
  isUnlocked?: boolean;
  description: string;
  imageUrl: string;
}

interface Offer {
  _id: string;
  discountPercent: number;
  endDate: string;
  iPhoneId: {
    _id: string;
  };
}

function ProductDetailsContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerId = searchParams.get('offer');

  const [product, setProduct] = useState<Product | null>(null);
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useOverlay();
  const { addToCart, cart } = useCart();
  
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedStoragePrice, setSelectedStoragePrice] = useState<number>(0);
  
  // Accordion State
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/iphones`);
        if (res.ok) {
          const data = await res.json();
          const productsArray = data.iphones || data;
          const found = productsArray?.find((p: Product) => p._id === id);
          if (found) {
            setProduct(found);
            if (found.colors && found.colors.length > 0) setSelectedColor(found.colors[0]);
            if (found.storageOptions && found.storageOptions.length > 0) {
              setSelectedStorage(found.storageOptions[0].capacity);
              setSelectedStoragePrice(found.storageOptions[0].price);
            } else {
              setSelectedStoragePrice(found.basePrice || found.price || 0);
            }

            // If arrived via offer link, validate the offer
            if (offerId) {
              const offerRes = await fetch(`/api/offers`);
              if (offerRes.ok) {
                const allOffers = await offerRes.json();
                const matchedOffer = allOffers.find((o: Offer) => o._id === offerId && o.iPhoneId?._id === id);
                if (matchedOffer && new Date(matchedOffer.endDate) > new Date()) {
                  setActiveOffer(matchedOffer);
                }
              }
            }
          } else {
            router.push('/shop');
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, router, offerId]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    
    // Validate only if product explicitly requires these traits
    const hasColors = product.colors && product.colors.length > 0;
    const hasStorage = product.storageOptions && product.storageOptions.length > 0;
    
    if (hasColors && !selectedColor) {
      showToast("Please select a finish/color option.", "info");
      return;
    }
    if (hasStorage && !selectedStorage) {
      showToast("Please select a storage capacity.", "info");
      return;
    }

    const priceToAdd = activeOffer 
      ? selectedStoragePrice - (selectedStoragePrice * activeOffer.discountPercent / 100)
      : selectedStoragePrice;

    addToCart({
      _id: product._id,
      model: product.model,
      price: priceToAdd,
      imageUrl: product.imageUrl,
      quantity: 1,
      selectedColor: selectedColor || 'Standard',
      selectedStorage: selectedStorage || 'Standard'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#7CB342]" />
      </div>
    );
  }

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="pt-[140px] max-w-7xl mx-auto px-4">
        <button 
          onClick={() => router.push('/shop')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </button>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Gallery Side */}
            <div className="p-8 md:p-16 bg-[#fbfbfd] flex flex-col justify-center relative min-h-[400px]">
               {isOutOfStock ? (
                 <div className="absolute top-8 left-8 z-10 px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-bold shadow-lg">
                    Out of Stock
                 </div>
               ) : isLowStock ? (
                 <div className="absolute top-8 left-8 z-10 px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-bold shadow-lg animate-pulse">
                    Wait! Only {product.stock} Left in Stock
                 </div>
               ) : (
                 <div className="absolute top-8 left-8 z-10 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm font-bold">
                    In Stock ({product.stock})
                 </div>
               )}

              <div className="relative w-full aspect-square">
                <Image
                  src={product.imageUrl}
                  alt={product.model}
                  fill
                  className="object-contain p-4 drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
              </div>
            </div>

            {/* Product Details Side */}
            <div className="p-8 md:p-12 flex flex-col bg-white">
              <div className="mb-2">
                <span className="text-sm font-bold tracking-widest text-[#7CB342] uppercase flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Original Apple Device
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                {product.model}
              </h1>

              {/* Badges Row */}
              <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-100">
                <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
                  {product.condition || 'New'}
                </span>
                {product.batteryHealth !== undefined && (
                  <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                    <Battery className="w-3 h-3" /> {product.batteryHealth}% Battery Health
                  </span>
                )}
                {product.isUnlocked !== undefined && (
                  <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                    <ShieldCheck className="w-3 h-3" /> {product.isUnlocked ? 'Factory Unlocked' : 'Carrier Locked'}
                  </span>
                )}
              </div>
              {activeOffer ? (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-full text-sm">
                      Save {activeOffer.discountPercent}%
                    </span>
                    <span className="text-gray-400 font-medium line-through text-xl">
                      LKR {(selectedStoragePrice || 0)?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-4xl font-extrabold text-red-600">
                    LKR {((selectedStoragePrice || 0) - ((selectedStoragePrice || 0) * activeOffer.discountPercent / 100))?.toLocaleString()}
                  </p>
                  <p className="text-sm text-red-500 font-medium mt-1">
                    Offer ends {new Date(activeOffer.endDate).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-3xl font-bold text-gray-900 mb-8">
                  LKR {(selectedStoragePrice || 0)?.toLocaleString()}
                </p>
              )}
              {/* Storage Selection */}
              {product.storageOptions && product.storageOptions.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                    Storage Capacity
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.storageOptions.map((opt) => (
                      <button
                        key={opt.capacity}
                        onClick={() => {
                          setSelectedStorage(opt.capacity);
                          setSelectedStoragePrice(opt.price);
                        }}
                        className={`px-6 py-3 rounded-xl border-2 font-bold transition-all hover:scale-105 ${
                          selectedStorage === opt.capacity
                            ? 'border-[#7CB342] bg-[#7CB342] text-white shadow-md'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                        }`}
                      >
                        {opt.capacity}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                    Finish / Color
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-5 py-3 rounded-xl border-2 font-bold flex items-center gap-2 transition-all hover:scale-105 ${
                          selectedColor === c
                            ? 'border-[#7CB342] bg-[#7CB342] text-white shadow-md'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                        }`}
                      >
                        {selectedColor === c && <Check className="w-4 h-4" />}
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Expandable Accordions */}
              <div className="mb-10 space-y-4 flex-1">
                {/* Description Accordion */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === 'description' ? null : 'description')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-bold text-gray-900 uppercase tracking-wider text-sm">Overview</span>
                    {openAccordion === 'description' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {openAccordion === 'description' && (
                    <div className="p-4 bg-white text-gray-600 leading-relaxed text-sm">
                      {product.description}
                    </div>
                  )}
                </div>

                {/* Technical Specs Accordion (Simulated) */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-bold text-gray-900 uppercase tracking-wider text-sm">Tech Specs</span>
                    {openAccordion === 'specs' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {openAccordion === 'specs' && (
                    <div className="p-4 bg-white text-gray-600 leading-relaxed text-sm space-y-2">
                      <p><strong>Display:</strong> Super Retina XDR display footprint.</p>
                      <p><strong>Processor:</strong> Advanced Apple Silicon chip.</p>
                      <p><strong>Camera:</strong> Pro camera system with advanced computational photography.</p>
                      <p><strong>Connectivity:</strong> 5G capable, Wi-Fi 6E, Bluetooth 5.3.</p>
                    </div>
                  )}
                </div>

                {/* Warranty & Returns */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === 'warranty' ? null : 'warranty')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-bold text-gray-900 uppercase tracking-wider text-sm">Warranty & Returns</span>
                    {openAccordion === 'warranty' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {openAccordion === 'warranty' && (
                    <div className="p-4 bg-white text-gray-600 leading-relaxed text-sm">
                      <p>Includes a 12-Month Apple Home Certified Warranty. 14-day hassle-free returns on all certified pristine and excellent graded devices.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upsell Module */}
              <div className="mb-8 p-4 bg-[#fbfbfd] rounded-2xl border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                   Frequently Bought Together
                </h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 text-[#7CB342] border-gray-300 rounded focus:ring-[#7CB342]" />
                  <span className="text-sm text-gray-700 group-hover:text-black transition-colors">Add Clear MagSafe Case <span className="text-gray-400">(+ LKR 12,000)</span></span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group mt-3">
                  <input type="checkbox" className="w-5 h-5 text-[#7CB342] border-gray-300 rounded focus:ring-[#7CB342]" />
                  <span className="text-sm text-gray-700 group-hover:text-black transition-colors">Add Premium Glass Screen Protector <span className="text-gray-400">(+ LKR 5,000)</span></span>
                </label>
              </div>

              {/* Add to Cart Footer */}
              <div className="pt-8 border-t border-gray-100 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                    isOutOfStock
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#7CB342] text-white hover:bg-[#6fa135] shadow-xl shadow-[#7CB342]/30 hover:scale-[1.02]'
                  }`}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                </button>
                {isOutOfStock && (
                  <p className="text-center text-sm text-gray-500 mt-4 font-medium">
                    This item is currently out of stock. Please check back later.
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const id = use(params).id;
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#7CB342]" />
      </div>
    }>
      <ProductDetailsContent id={id} />
    </Suspense>
  );
}
