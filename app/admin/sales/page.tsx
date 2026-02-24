// app/admin/sales/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
  const [sales, setSales] = useState<Sale[]>([]);
  const [overview, setOverview] = useState({ today: '0', week: '0', month: '0', year: '0' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch('/api/admin/sales');
        if (res.ok) {
          const data = await res.json();
          setSales(data.list);
          setOverview(data.overview);
        }
      } catch (err) {
        console.error('Failed to load sales data.');
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-black">Sales </span>
            <span className="text-[#7CB342]">Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-1">Monitor and manage all sales receipts</p>
        </div>

        {loading ? (
          <div className="animate-pulse flex flex-col gap-6">
            <div className="h-32 bg-gray-200 rounded-2xl w-full"></div>
            <div className="h-64 bg-gray-200 rounded-2xl w-full"></div>
          </div>
        ) : (
          <>
            {/* Overview */}
            <SalesOverview overview={overview} />

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
          </>
        )}
      </main>
    </div>
  );
}