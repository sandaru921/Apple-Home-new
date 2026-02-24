// app/admin/customize/page.tsx
'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Upload, Plus, Trash2, Loader2, Save } from 'lucide-react';
import Image from 'next/image';

interface Slide {
  _id: string;
  imageUrl: string;
}

export default function CustomizePage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/slides');
      if (!res.ok) throw new Error('Failed to fetch slides');
      const data = await res.json();
      setSlides(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    
    try {
      const res = await fetch(`/api/slides/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete slide');
      
      setSlides(prev => prev.filter(s => s._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
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
      </main>
    </div>
  );
}