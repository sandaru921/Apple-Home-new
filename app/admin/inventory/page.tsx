// app/admin/inventory/page.tsx
'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import InventoryTable from '@/components/InventoryTable';
import AddProductModal from '@/components/AddProductModal';
import EditProductModal from '@/components/EditProductModal';
import { Plus, Search, AlertCircle, Loader2 } from 'lucide-react';
import { useOverlay } from '@/components/providers/OverlayProvider';

interface Product {
  _id: string;
  category?: string;
  model: string;
  price: number;
  stock: number;
  colors?: string[];
  storage?: string[];
  condition?: string;
  batteryHealth?: number;
  isUnlocked?: boolean;
  description: string;
  imageUrl: string;
  featured?: boolean;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showConfirm, showToast } = useOverlay();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/iphones');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdate = (updatedProduct: Product) => {
    setProducts((prev) => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
  };

  const handleDelete = (id: string) => {
    showConfirm({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/iphones/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Failed to delete product');
          
          setProducts((prev) => prev.filter((p) => p._id !== id));
          showToast('Product deleted successfully', 'success');
        } catch (err: any) {
          showToast(err.message, 'error');
        }
      }
    });
  };

  const filteredProducts = products.filter((p) =>
    p.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-black">Inventory </span>
              <span className="text-[#7CB342]">Management</span>
            </h1>
            <p className="text-gray-600 mt-1">Track and manage your iPhone catalog</p>
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200 text-center">
            {error}
          </div>
        )}

        {/* Table/Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-[#7CB342] animate-spin" />
          </div>
        ) : (
          <InventoryTable
            products={filteredProducts}
            onEdit={(id) => {
              const productToEdit = products.find(p => p._id === id);
              if (productToEdit) {
                // @ts-ignore - Temporary cast to bypass strict initial mapping types
                setEditingProduct(productToEdit);
                setIsEditModalOpen(true);
              }
            }}
            onDelete={handleDelete}
          />
        )}

        {/* Modals */}
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAdd}
        />
        
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
          onUpdate={handleUpdate}
          initialData={editingProduct}
        />
      </main>
    </div>
  );
}