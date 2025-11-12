// app/admin/page.tsx
'use client';

import { useState } from 'react';
import { IPHONE_MODELS, COLORS, STORAGE_OPTIONS } from '@/lib/iphone-models';

export default function AdminUpload() {
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const toggleSelect = (arr: string[], value: string, setter: (v: string[]) => void) => {
    setter(arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget; // ← Save reference BEFORE await
  setUploading(true);
  setMessage('');

  const formData = new FormData(form);

  // Add state values
  formData.append('model', selectedModel);
  formData.append('price', price);
  formData.append('description', description);
  selectedColors.forEach(c => formData.append('colors', c));
  selectedStorage.forEach(s => formData.append('storage', s));

  try {
    const res = await fetch(`${window.location.origin}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setMessage('iPhone uploaded successfully!');
      form.reset(); // ← Use saved form
      setSelectedModel('');
      setSelectedColors([]);
      setSelectedStorage([]);
      setPrice('');
      setDescription('');
    } else {
      setMessage(`Error: ${data.error || 'Upload failed'}`);
    }
  } catch (err: any) {
    setMessage('Network error: ' + err.message);
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-text-light dark:text-text-dark">
          iPhone Shop Admin
        </h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl space-y-6">
          {/* Model */}
          <div>
            <label className="block text-sm font-medium mb-2">iPhone Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Choose model...</option>
              {IPHONE_MODELS.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium mb-2">Colors (Choose many)</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {COLORS.map(color => (
                <label
                  key={color}
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-primary/5 dark:hover:bg-gray-800 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color)}
                    onChange={() => toggleSelect(selectedColors, color, setSelectedColors)}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <span className="text-sm">{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Storage */}
          <div>
            <label className="block text-sm font-medium mb-2">Storage (Choose many)</label>
            <div className="flex flex-wrap gap-3">
              {STORAGE_OPTIONS.map(storage => (
                <label
                  key={storage}
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-primary/5 dark:hover:bg-gray-800 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedStorage.includes(storage)}
                    onChange={() => toggleSelect(selectedStorage, storage, setSelectedStorage)}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <span className="text-sm">{storage}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2">Price (LKR)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="449900"
              className="w-full px-4 py-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Titanium. A17 Pro. All-new design..."
              className="w-full px-4 py-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload Image</label>
            <input
              name="image"
              type="file"
              accept="image/*"
              required
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {uploading ? 'Uploading...' : 'UPLOAD IPHONE'}
          </button>

          {message && (
            <p className={`text-center font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}