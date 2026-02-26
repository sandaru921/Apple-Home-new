// components/EditProductModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, UploadCloud, Check } from 'lucide-react';
import Image from 'next/image';

const PREDEFINED_MODELS = [
  'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
  'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
  'iPhone 14 Plus', 'iPhone 14', 'iPhone 13', 'iPhone SE (3rd Gen)',
  'MacBook Pro 16"', 'MacBook Pro 14"', 'MacBook Air M3', 'MacBook Air M2',
  'iPad Pro', 'iPad Air', 'iPad mini', 'iPad',
  'Apple Watch Ultra 2', 'Apple Watch Series 9', 'Apple Watch SE',
  'AirPods Pro (2nd Gen)', 'AirPods (3rd Gen)', 'AirPods Max'
];

const PREDEFINED_STORAGE = ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB', '8GB RAM', '16GB RAM', '32GB RAM', '64GB RAM', 'N/A'];

const PREDEFINED_COLORS = [
  'Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium', 
  'Midnight', 'Starlight', 'Product Red', 'Yellow', 'Blue', 'Green', 'Pink', 
  'Space Black', 'Silver', 'Space Gray', 'Gold', 'Purple'
];

interface Product {
  _id?: string;
  category?: string;
  model: string;
  colors?: string[];
  colors?: string[];
  basePrice: number;
  storageOptions: { capacity: string; price: number }[];
  stock: number;
  condition?: string;
  batteryHealth?: number;
  isUnlocked?: boolean;
  description: string;
  imageUrl: string;
  featured?: boolean;
}

const CATEGORIES = [
  'Used iPhones', 'Brand New iPhones', 'Earbuds', 'Watches', 'Chargers & Accessories'
];

const CONDITIONS = ['New', 'Pristine (Used)', 'Excellent (Used)', 'Good (Used)'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (product: any) => void;
  initialData: Product | null;
}

export default function EditProductModal({ isOpen, onClose, onUpdate, initialData }: Props) {
  const [category, setCategory] = useState(CATEGORIES[1]);
  const [model, setModel] = useState(PREDEFINED_MODELS[0]);
  const [customModel, setCustomModel] = useState('');
  const [isCustomModel, setIsCustomModel] = useState(false);

  const [basePrice, setBasePrice] = useState('');
  const [stock, setStock] = useState('10');
  
  // Optional Toggles
  const [includeCondition, setIncludeCondition] = useState(false);
  const [condition, setCondition] = useState('New');
  
  const [includeBatteryHealth, setIncludeBatteryHealth] = useState(false);
  const [batteryHealth, setBatteryHealth] = useState('100');
  
  const [includeUnlocked, setIncludeUnlocked] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(true);

  const [storageOptions, setStorageOptions] = useState<{ capacity: string; price: string }[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  
  // Image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isIphoneCategory = category === 'Used iPhones' || category === 'Brand New iPhones';

  useEffect(() => {
    if (initialData && isOpen) {
      setCategory(initialData.category || CATEGORIES[1]);
      
      if (PREDEFINED_MODELS.includes(initialData.model)) {
        setModel(initialData.model);
        setIsCustomModel(false);
        setCustomModel('');
      } else {
        setModel('custom_entry');
        setIsCustomModel(true);
        setCustomModel(initialData.model);
      }

      setBasePrice(initialData.basePrice?.toString() || '');
      setStock((initialData.stock ?? 0).toString());
      
      setIncludeCondition(!!initialData.condition);
      setCondition(initialData.condition || 'New');
      
      setIncludeBatteryHealth(initialData.batteryHealth !== undefined && initialData.batteryHealth !== null);
      setBatteryHealth((initialData.batteryHealth ?? 100).toString());
      
      setIncludeUnlocked(initialData.isUnlocked !== undefined && initialData.isUnlocked !== null);
      setIsUnlocked(initialData.isUnlocked ?? true);
      
      setStorageOptions(
        initialData.storageOptions
          ? initialData.storageOptions.map(opt => ({ ...opt, price: opt.price.toString() }))
          : []
      );
      setSelectedColors(initialData.colors || []);
      setDescription(initialData.description || '');
      setImagePreview(initialData.imageUrl || null);
      setImageFile(null); // Clear any pending file if navigating
    }
  }, [initialData, isOpen]);

  if (!isOpen || !initialData) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const toggleSelection = (item: string, current: string[], setter: (val: string[]) => void) => {
    if (current.includes(item)) {
      setter(current.filter(i => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview && !imageFile) {
      setError('Please select a product image.');
      return;
    }
    if (storageOptions.length === 0 || selectedColors.length === 0) {
      setError('Please add at least one storage option and select a color.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const finalModelName = (!isIphoneCategory || isCustomModel) ? customModel : model;
      if (!finalModelName.trim()) {
        setError('Please provide a Model Name.');
        setLoading(false);
        return;
      }

      let finalImageUrl = initialData.imageUrl;

      // 1. Upload new image if file is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('type', 'productImage');
        formData.append('image', imageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Failed to upload image to Cloudinary');
        
        const { url: newImageUrl } = await uploadRes.json();
        finalImageUrl = newImageUrl;
      }

      // 2. Update Product in Database
      const payload: Product = {
        category,
        model: finalModelName,
        basePrice: Number(basePrice),
        stock: Number(stock),
        description,
        imageUrl: finalImageUrl,
        storageOptions: storageOptions.map(opt => ({ capacity: opt.capacity, price: Number(opt.price) })),
        ...(selectedColors.length > 0 && { colors: selectedColors }),
        ...(includeCondition && { condition }),
        ...(includeBatteryHealth && { batteryHealth: Number(batteryHealth) }),
        ...(includeUnlocked && { isUnlocked })
      };

      const res = await fetch(`/api/iphones/${initialData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update product record');
      }

      const updatedProduct = await res.json();
      onUpdate(updatedProduct);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative overflow-y-auto max-h-[95vh] scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl transition"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          <span className="text-black">Edit </span>
          <span className="text-[#7CB342]">Product</span>
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Zone */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Product Photo</label>
             <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center text-center overflow-hidden h-40">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {imagePreview ? (
                   <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-white">
                      <Image src={imagePreview} alt="Preview" fill className="object-contain p-2" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-full">Change Image</span>
                      </div>
                   </div>
                ) : (
                   <>
                      <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">Drag & drop or click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">High resolution PNG or JPG</p>
                   </>
                )}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setIsCustomModel(false);
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7CB342] text-gray-900"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Model Selection / Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
              {isIphoneCategory ? (
                <>
                  {!isCustomModel ? (
                    <select
                      value={model}
                      onChange={(e) => {
                        if (e.target.value === 'custom_entry') setIsCustomModel(true);
                        else setModel(e.target.value);
                      }}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7CB342] text-gray-900"
                    >
                      {PREDEFINED_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                      <option value="custom_entry" className="font-bold text-[#7CB342]">Enter Manually...</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                       <input 
                         type="text"
                         value={customModel}
                         onChange={(e) => setCustomModel(e.target.value)}
                         placeholder="e.g. iPhone 17 Pro"
                         className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                       />
                       <button type="button" onClick={() => setIsCustomModel(false)} className="px-3 text-xs bg-gray-200 rounded-xl hover:bg-gray-300">
                         Back to List
                       </button>
                    </div>
                  )}
                </>
              ) : (
                <input 
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="e.g. AirPods Pro Max"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                  required
                />
              )}
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price / Starting Price (LKR)</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                  placeholder="429000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">In Stock</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                  required
                />
              </div>
            </div>

            {/* Optional Details Panel */}
            <div className="md:col-span-2 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Optional Device Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 
                 {/* Condition Toggle */}
                 <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                   <label className="flex items-center gap-2 mb-3 cursor-pointer">
                     <input type="checkbox" checked={includeCondition} onChange={(e) => setIncludeCondition(e.target.checked)} className="w-4 h-4 text-[#7CB342] rounded" />
                     <span className="text-sm font-medium">Add Condition</span>
                   </label>
                   {includeCondition && (
                     <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                        {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                   )}
                 </div>

                 {/* Battery Toggle */}
                 <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                   <label className="flex items-center gap-2 mb-3 cursor-pointer">
                     <input type="checkbox" checked={includeBatteryHealth} onChange={(e) => setIncludeBatteryHealth(e.target.checked)} className="w-4 h-4 text-[#7CB342] rounded" />
                     <span className="text-sm font-medium">Add Battery Capacity</span>
                   </label>
                   {includeBatteryHealth && (
                     <div className="relative">
                       <input type="number" max="100" min="0" value={batteryHealth} onChange={(e) => setBatteryHealth(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm pr-8" />
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                     </div>
                   )}
                 </div>

                 {/* Unlocked Toggle */}
                 <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col justify-center">
                   <label className="flex items-center gap-2 cursor-pointer">
                     <input type="checkbox" checked={includeUnlocked} onChange={(e) => setIncludeUnlocked(e.target.checked)} className="w-4 h-4 text-[#7CB342] rounded" />
                     <span className="text-sm font-medium">Include Unlocked Tag</span>
                   </label>
                   {includeUnlocked && (
                     <label className="flex items-center gap-2 mt-3 pl-6 cursor-pointer">
                       <input type="checkbox" checked={isUnlocked} onChange={(e) => setIsUnlocked(e.target.checked)} className="w-4 h-4 text-black rounded" />
                       <span className="text-xs text-gray-600">Is Factory Unlocked?</span>
                     </label>
                   )}
                 </div>

              </div>
            </div>
          </div>

          {/* Dynamic Storage Array */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Storage Capacities & Pricing</label>
              <button
                type="button"
                onClick={() => setStorageOptions([...storageOptions, { capacity: PREDEFINED_STORAGE[0], price: basePrice }])}
                className="text-sm font-bold text-[#7CB342] hover:text-[#5c8a2e]"
              >
                + Add Storage Option
              </button>
            </div>
            {storageOptions.length === 0 ? (
              <p className="text-sm text-gray-400 italic mb-2">Configure at least one variant to proceed.</p>
            ) : (
              <div className="space-y-3">
                {storageOptions.map((opt, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <select
                      value={opt.capacity}
                      onChange={(e) => {
                        const newOpts = [...storageOptions];
                        newOpts[idx].capacity = e.target.value;
                        setStorageOptions(newOpts);
                      }}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    >
                      {PREDEFINED_STORAGE.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        value={opt.price}
                        onChange={(e) => {
                          const newOpts = [...storageOptions];
                          newOpts[idx].price = e.target.value;
                          setStorageOptions(newOpts);
                        }}
                        placeholder="Price for this capacity"
                        className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        required
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">LKR</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStorageOptions(storageOptions.filter((_, i) => i !== idx))}
                      className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Colors Array */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors</label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_COLORS.map(c => {
                const isSelected = selectedColors.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleSelection(c, selectedColors, setSelectedColors)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${
                       isSelected 
                       ? 'bg-[#7CB342] text-white border-transparent shadow-sm' 
                       : 'bg-white border border-gray-200 text-gray-600 hover:border-[#7CB342]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {c}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7CB342] h-24 resize-none"
              placeholder="The ultimate Apple experience..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#7CB342] text-white rounded-xl font-bold hover:bg-[#6fa135] transition-all disabled:opacity-70 flex justify-center items-center shadow-lg hover:shadow-[#7CB342]/40"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
}