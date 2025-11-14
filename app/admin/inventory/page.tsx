// app/admin/inventory/page.tsx
'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import InventoryTable from '@/components/InventoryTable';
import AddProductModal from '@/components/AddProductModal';
import { Plus, Search, AlertCircle } from 'lucide-react';

interface Product {
  _id: string;
  model: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      _id: '1',
      model: 'iPhone 15 Pro Max',
      price: 349999,
      stock: 45,
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
    },
    {
      _id: '2',
      model: 'iPhone 15',
      price: 249999,
      stock: 8,
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
    },
    {
      _id: '3',
      model: 'iPhone 14',
      price: 199999,
      stock: 120,
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdd = (newProduct: Omit<Product, '_id'>) => {
    const product = { ...newProduct, _id: Date.now().toString() };
    setProducts((prev) => [...prev, product]);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this product?')) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  const filteredProducts = products.filter((p) =>
    p.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-black">Inventory </span>
              <span className="text-[#7CB342]">Management</span>
            </h1>
            <p className="text-gray-600 mt-1">Track and manage your iPhone stock</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#7CB342] text-white rounded-xl font-bold hover:bg-[#6fa135] transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
            />
          </div>
        </div>

        {/* Low Stock Alert */}
        {products.some(p => p.stock < 10) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 font-medium">
              {products.filter(p => p.stock < 10).length} items need restocking
            </p>
          </div>
        )}

        {/* Table */}
        <InventoryTable
          products={filteredProducts}
          onEdit={(id) => alert(`Edit ${id}`)}
          onDelete={handleDelete}
        />

        {/* Modal */}
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAdd}
        />
      </main>
    </div>
  );
}