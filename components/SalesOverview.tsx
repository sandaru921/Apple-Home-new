// components/SalesOverview.tsx
'use client';

import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

export default function SalesOverview() {
  const stats = [
    { label: 'Today', value: 'LKR 285,000', change: '+18%', icon: Calendar },
    { label: 'This Week', value: 'LKR 1.8M', change: '+12%', icon: TrendingUp },
    { label: 'This Month', value: 'LKR 7.2M', change: '+9%', icon: DollarSign },
    { label: 'This Year', value: 'LKR 86.4M', change: '+22%', icon: DollarSign },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <Icon className="w-6 h-6 text-[#7CB342]" />
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}