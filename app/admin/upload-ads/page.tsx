// app/admin/upload-ads/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Upload, Plus, X } from 'lucide-react';

interface IPhoneData {
  _id: string;
  model: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'slides' | 'offers'>('slides');
  const [slideFile, setSlideFile] = useState<File | null>(null);
  const [offeriPhone, setOfferiPhone] = useState('');
  const [discount, setDiscount] = useState('');
  const [endDate, setEndDate] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [availablePhones, setAvailablePhones] = useState<IPhoneData[]>([]);

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const res = await fetch('/api/iphones');
        if (res.ok) {
          const data = await res.json();
          setAvailablePhones(data);
        }
      } catch (err) {
        console.error('Failed to load iPhones', err);
      }
    };
    if (activeTab === 'offers') {
      fetchPhones();
    }
  }, [activeTab]);

  const uploadSlide = async () => {
    if (!slideFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', slideFile);
    formData.append('type', 'slide');

    try {
      const res = await fetch(`${window.location.origin}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMessage(data.success ? 'Slide uploaded!' : data.error);
      setSlideFile(null);
    } catch {
      setMessage('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const createOffer = async () => {
    if (!offeriPhone || !discount || !endDate) return;
    const formData = new FormData();
    formData.append('type', 'offer');
    formData.append('iPhoneId', offeriPhone);
    formData.append('discount', discount);
    formData.append('endDate', endDate);

    try {
      const res = await fetch(`${window.location.origin}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMessage(data.success ? 'Offer created!' : data.error);
    } catch {
      setMessage('Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Panel</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('slides')}
            className={`px-6 py-2 rounded-xl font-medium ${activeTab === 'slides' ? 'bg-[#7CB342] text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
          >
            Slideshow
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-6 py-2 rounded-xl font-medium ${activeTab === 'offers' ? 'bg-[#7CB342] text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
          >
            Offers
          </button>
        </div>

        {activeTab === 'slides' && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Upload Slideshow Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSlideFile(e.target.files?.[0] || null)}
              className="mb-4"
            />
            <button
              onClick={uploadSlide}
              disabled={!slideFile || uploading}
              className="px-6 py-3 bg-[#7CB342] text-white rounded-xl hover:bg-[#6fa135] disabled:opacity-50 flex items-center gap-2 transition"
            >
              <Upload className="w-5 h-5" />
              {uploading ? 'Uploading...' : 'Upload Slide'}
            </button>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Create Flash Offer</h2>
            <select
              value={offeriPhone}
              onChange={(e) => setOfferiPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
            >
              <option value="">Select an iPhone from Database</option>
              {availablePhones.map(phone => (
                <option key={phone._id} value={phone._id}>{phone.model}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Discount % (e.g. 30)"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl dark:bg-gray-800"
            />
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl dark:bg-gray-800"
            />
            <button
              onClick={createOffer}
              className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold"
            >
              Create Offer
            </button>
          </div>
        )}

        {message && (
          <p className={`mt-6 text-center font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}