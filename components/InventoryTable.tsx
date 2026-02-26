// components/InventoryTable.tsx
'use client';

import Image from 'next/image';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';

interface Product {
  _id: string;
  model: string;
  basePrice: number;
  stock?: number;
  condition?: string;
  imageUrl: string;
}

interface Props {
  products: Product[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function InventoryTable({ products, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full max-w-[100vw] sm:max-w-none">
      
      {/* Mobile Card View (Visible only on small screens) */}
      <div className="md:hidden divide-y divide-gray-100">
        {products.map((product) => {
          const isLowStock = (product.stock || 0) < 10;
          return (
            <div key={product._id} className="p-4 bg-white hover:bg-gray-50 flex flex-col gap-3">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                  <Image
                    src={product.imageUrl}
                    alt={product.model}
                    width={64}
                    height={64}
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{product.model}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                      {product.condition || 'New'}
                    </span>
                    {isLowStock ? (
                       <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                         <AlertCircle className="w-3 h-3" /> Low Stock
                       </span>
                    ) : (
                       <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                         In Stock
                       </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2 border-t border-gray-50 pt-2">
                <div className="flex flex-col">
                  <span className="text-[#7CB342] font-black text-lg">LKR {(product.basePrice || 0)?.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 font-medium">Qty: {product.stock ?? 0}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(product._id)}
                    className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                    aria-label="Edit product"
                  >
                    <Edit2 className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="p-2.5 bg-red-50 hover:bg-red-100 rounded-xl transition"
                    aria-label="Delete product"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {products.length === 0 && (
          <div className="p-6 text-center text-gray-500">No products found.</div>
        )}
      </div>

      {/* Desktop Table View (Hidden on small screens) */}
      <div className="hidden md:block overflow-x-auto w-full">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => {
              const isLowStock = (product.stock || 0) < 10;
              return (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                        <Image
                          src={product.imageUrl}
                          alt={product.model}
                          width={48}
                          height={48}
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="font-medium text-gray-900">{product.model}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700 font-medium">
                      {product.condition || 'New'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[#7CB342] font-bold">LKR {(product.basePrice || 0)?.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                        <AlertCircle className="w-3 h-3" />
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-green-600 text-xs font-medium">In Stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(product._id)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => onDelete(product._id)}
                        className="p-2 hover:bg-red-50 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}