// components/DashboardStats.tsx
'use client';
import { useState, useEffect } from 'react';

interface StatsProps {
  stats: {
    totalSales: string;
    activeCustomers: number;
    inStock: number;
    pendingOrders: number;
  };
}

export default function DashboardStats({ stats }: StatsProps) {
  const displayStats = [
    { label: 'Total Sales', value: stats.totalSales, change: 'Lifetime', color: 'text-[#7CB342]' },
    { label: 'Active Customers', value: stats.activeCustomers.toString(), change: 'Total Registered', color: 'text-blue-600' },
    { label: 'In Stock', value: stats.inStock.toString(), change: 'Total Listings', color: 'text-orange-600' },
    { label: 'Pending Orders', value: stats.pendingOrders.toString(), change: 'Awaiting shipping', color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayStats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
          <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
          <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
        </div>
      ))}
    </div>
  );
}