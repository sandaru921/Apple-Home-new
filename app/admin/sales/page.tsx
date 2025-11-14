// app/admin/sales/page.tsx
'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import SalesOverview from '@/components/SalesOverview';
import SalesTable from '@/components/SalesTable';
import NewSaleNotification from '@/components/NewSaleNotification';

interface Sale {
  _id: string;
  receiptNo: string;
  customer: string;
  items: number;
  total: number;
  date: string;
  status: 'Paid' | 'Pending';
}

export default function SalesPage() {
  const [sales] = useState<Sale[]>([
    {
      _id: '1',
      receiptNo: '1005',
      customer: 'Nimal Perera',
      items: 1,
      total: 299999,
      date: '2025-04-05 14:30',
      status: 'Paid',
    },
    {
      _id: '2',
      receiptNo: '1004',
      customer: 'Kamal Silva',
      items: 2,
      total: 549998,
      date: '2025-04-05 12:15',
      status: 'Paid',
    },
    {
      _id: '3',
      receiptNo: '1003',
      customer: 'Sunil Jayasinghe',
      items: 1,
      total: 249999,
      date: '2025-04-04 18:45',
      status: 'Pending',
    },
  ]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <NewSaleNotification />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-black">Sales </span>
            <span className="text-[#7CB342]">Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-1">Monitor and manage all sales receipts</p>
        </div>

        {/* Overview */}
        <SalesOverview />

        {/* Recent Sales */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-6">Recent Receipts</h2>
          <SalesTable sales={sales} />
        </div>

        {/* Export */}
        <div className="mt-6 flex justify-end">
          <button className="px-6 py-3 bg-[#7CB342] text-white rounded-xl font-medium hover:bg-[#6fa135] transition">
            Export to CSV
          </button>
        </div>
      </main>
    </div>
  );
}