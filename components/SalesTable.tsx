// components/SalesTable.tsx
'use client';

import { Eye, Printer, Search } from 'lucide-react';
import Image from 'next/image';

interface Sale {
  _id: string;
  receiptNo: string;
  customer: string;
  items: number;
  total: number;
  date: string;
  status: 'Paid' | 'Pending';
}

interface Props {
  sales: Sale[];
}

export default function SalesTable({ sales }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full max-w-[100vw] sm:max-w-none">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 hidden sm:block" />
          <input
            type="text"
            placeholder="Search receipts..."
            className="w-full sm:flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
          />
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-100">
        {sales.map((sale) => (
          <div key={sale._id} className="p-4 bg-white hover:bg-gray-50 flex flex-col gap-3">
             <div className="flex justify-between items-start">
               <div>
                 <span className="font-mono text-sm font-bold text-[#7CB342]">#{sale.receiptNo}</span>
                 <p className="text-xs text-gray-500 mt-1">{sale.date}</p>
               </div>
               <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  sale.status === 'Paid'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-yellow-50 text-yellow-700'
                }`}>
                  {sale.status}
                </span>
             </div>
             
             <div className="flex items-center gap-2 mt-2">
               <div className="w-8 h-8 bg-gray-200 rounded-full border shrink-0" />
               <span className="font-medium text-gray-900">{sale.customer}</span>
             </div>

             <div className="flex justify-between items-center mt-2 border-t border-gray-50 pt-2">
                <div className="flex flex-col">
                  <span className="font-black text-lg text-[#7CB342]">LKR {(sale.total || 0).toLocaleString()}</span>
                  <span className="text-sm text-gray-500 font-medium">{sale.items} Items</span>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition">
                    <Eye className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition">
                    <Printer className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
             </div>
          </div>
        ))}
        {sales.length === 0 && (
          <div className="p-6 text-center text-gray-500">No recent sales found.</div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto w-full">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Receipt</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales.map((sale) => (
              <tr key={sale._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-bold text-[#7CB342]">#{sale.receiptNo}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full border" />
                    <span className="font-medium">{sale.customer}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{sale.items}</td>
                <td className="px-6 py-4">
                  <span className="font-bold text-[#7CB342]">LKR {(sale.total || 0).toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{sale.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    sale.status === 'Paid'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {sale.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-xl transition">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-xl transition">
                      <Printer className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}