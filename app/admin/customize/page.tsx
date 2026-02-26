// app/admin/customize/page.tsx
'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Upload, Plus, Trash2, Loader2, Save } from 'lucide-react';
import Image from 'next/image';
import { useOverlay } from '@/components/providers/OverlayProvider';

interface Slide {
  _id: string;
  imageUrl: string;
}
interface Offer {
  _id: string;
  discountPercent: number;
  endDate: string;
  iPhoneId: {
    _id: string;
    model: string;
    basePrice: number;
    imageUrl: string;
  };
}

interface InventoryItem {
  _id: string;
  model: string;
  basePrice: number;
}

export default function CustomizePage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { showConfirm, showToast } = useOverlay();

  const [offerForm, setOfferForm] = useState({
    iPhoneId: '',
    discountPercent: '',
    endDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [slidesRes, offersRes, invRes] = await Promise.all([
        fetch('/api/slides'),
        fetch('/api/offers'),
        fetch('/api/iphones')
      ]);

      if (!slidesRes.ok) throw new Error('Failed to fetch slides');
      
      setSlides(await slidesRes.json());
      
      if (offersRes.ok) setOffers(await offersRes.json());
      if (invRes.ok) setInventory(await invRes.json());
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/slides');
      if (res.ok) setSlides(await res.json());
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/offers');
      if (res.ok) setOffers(await res.json());
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      setError('');
      
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerForm),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create offer');
      }

      await fetchOffers(); // Refresh table
      setOfferForm({ iPhoneId: '', discountPercent: '', endDate: '' }); // Reset form
      showToast('Offer created successfully!', 'success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteOffer = (id: string) => {
    showConfirm({
      title: 'Delete Offer',
      message: 'Are you sure you want to delete this offer?',
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Failed to delete offer');
          
          setOffers(prev => prev.filter(o => o._id !== id));
          showToast('Offer deleted', 'success');
        } catch (err: any) {
          setError(err.message);
        }
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('type', 'slide');
      formData.append('image', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload slide');

      // Refresh slides after successful upload
      await fetchSlides();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDeleteSlide = (id: string) => {
    showConfirm({
      title: 'Delete Slide',
      message: 'Are you sure you want to delete this slide?',
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/slides/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Failed to delete slide');
          
          setSlides(prev => prev.filter(s => s._id !== id));
          showToast('Slide deleted', 'success');
        } catch (err: any) {
          showToast(err.message, 'error');
        }
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-black">Customize </span>
            <span className="text-[#7CB342]">Homepage</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage hero slides and featured content</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">
            {error}
          </div>
        )}

        {/* Slides */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Hero Slides</h2>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="mb-6 relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
              />
              <button 
                disabled={uploading}
                className="flex items-center gap-2 px-6 py-3 bg-[#7CB342] text-white rounded-xl hover:bg-[#6fa135] transition disabled:opacity-70"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {uploading ? 'Uploading...' : 'Upload New Slide'}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-[#7CB342] animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {slides.map((slide) => (
                  <div key={slide._id} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-[2/1] bg-gray-100">
                    <Image
                      src={slide.imageUrl}
                      alt="Hero Slide"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => handleDeleteSlide(slide._id)}
                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 transition-all shadow-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {slides.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No slides uploaded yet. The homepage will show a default fallback.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Featured placeholder section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Featured Products Note</h2>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-gray-600">
            Featured products are currently pulled automatically from your newest iPhone inventory.
          </div>
        </section>

        {/* Special Offers Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Special Offers</h2>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Create New Offer</h3>
            <form onSubmit={handleCreateOffer} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Select Product</label>
                <select 
                  required
                  value={offerForm.iPhoneId}
                  onChange={(e) => setOfferForm({ ...offerForm, iPhoneId: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7CB342] focus:border-transparent"
                >
                  <option value="">-- Choose an iPhone --</option>
                  {inventory.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.model} (LKR {(item.basePrice || 0)?.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Discount Percentage (%)</label>
                <input 
                  type="number"
                  required
                  min="1"
                  max="99"
                  placeholder="e.g. 15"
                  value={offerForm.discountPercent}
                  onChange={(e) => setOfferForm({ ...offerForm, discountPercent: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7CB342] focus:border-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">End Date & Time</label>
                <input 
                  type="datetime-local"
                  required
                  value={offerForm.endDate}
                  onChange={(e) => setOfferForm({ ...offerForm, endDate: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7CB342] focus:border-transparent"
                />
              </div>

              <div className="md:col-span-3 flex justify-end mt-2">
                <button 
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 px-6 py-2 bg-[#7CB342] text-white rounded-xl hover:bg-[#6fa135] transition disabled:opacity-70 font-semibold"
                >
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Offer
                </button>
              </div>
            </form>

            <h3 className="text-lg font-semibold mb-4">Active Offers</h3>
            {offers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                No active offers found. Create one above to display the flash sale banner on your homepage.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full max-w-[100vw] sm:max-w-none">
                
                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-100">
                  {offers.map((offer) => (
                    <div key={offer._id} className="p-4 bg-white hover:bg-gray-50 flex flex-col gap-3">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 relative bg-white border border-gray-100 rounded-xl p-2 shrink-0">
                           <Image src={offer.iPhoneId?.imageUrl || '/api/placeholder/400/400'} alt="Product" fill className="object-contain" unoptimized />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg leading-tight">{offer.iPhoneId?.model || 'Unknown Product'}</h4>
                          <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full text-xs">
                            {offer.discountPercent}% OFF
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2 border-t border-gray-50 pt-3">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Ends On</span>
                          <span className="text-sm font-semibold text-gray-700">{new Date(offer.endDate)?.toLocaleString()}</span>
                        </div>
                        
                        <button 
                          onClick={() => handleDeleteOffer(offer._id)}
                          className="p-2.5 bg-red-50 hover:bg-red-100 rounded-xl transition"
                          title="Delete Offer"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                        <th className="p-4 rounded-tl-xl font-medium">Product</th>
                        <th className="p-4 font-medium text-center">Discount</th>
                        <th className="p-4 font-medium">Ends On</th>
                        <th className="p-4 rounded-tr-xl font-medium text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {offers.map((offer) => (
                      <tr key={offer._id} className="hover:bg-gray-50/50 transition">
                         <td className="p-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 relative bg-white border border-gray-100 rounded-lg p-1">
                                <Image src={offer.iPhoneId?.imageUrl || '/api/placeholder/400/400'} alt="Product" fill className="object-contain" unoptimized />
                              </div>
                              <span className="font-semibold text-gray-800">{offer.iPhoneId?.model || 'Unknown Product'}</span>
                           </div>
                         </td>
                         <td className="p-4 text-center">
                            <span className="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">
                              {offer.discountPercent}% OFF
                            </span>
                         </td>
                         <td className="p-4 text-gray-600">
                            {new Date(offer.endDate)?.toLocaleString()}
                         </td>
                         <td className="p-4 text-right">
                           <button 
                             onClick={() => handleDeleteOffer(offer._id)}
                             className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                             title="Delete Offer"
                           >
                             <Trash2 className="w-5 h-5" />
                           </button>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}