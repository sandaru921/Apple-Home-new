// app/admin/customize/page.tsx
'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Upload, Plus, Trash2, Save } from 'lucide-react';

export default function CustomizePage() {
  const [slides, setSlides] = useState<string[]>([]);
  const [featured, setFeatured] = useState<string[]>(['iPhone 15 Pro', 'iPhone 16']);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-black">Customize </span>
            <span className="text-[#7CB342]">Homepage</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage slides, offers, and featured products</p>
        </div>

        {/* Slides */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Hero Slides</h2>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#7CB342] text-white rounded-xl hover:bg-[#6fa135] transition">
              <Upload className="w-4 h-4" />
              Upload Slide
            </button>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {slides.map((url, i) => (
                <div key={i} className="relative group">
                  <div className="h-32 bg-gray-100 rounded-xl border" />
                  <button className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Featured Products</h2>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="space-y-3">
              {featured.map((model, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium">{model}</span>
                  <button className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button className="flex items-center gap-2 text-[#7CB342] hover:underline">
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-6 py-3 bg-[#7CB342] text-white rounded-xl font-bold hover:bg-[#6fa135]">
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}