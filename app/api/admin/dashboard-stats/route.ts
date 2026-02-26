export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import iPhone from '@/models/iPhone';
import Offer from '@/models/Offer';

export async function GET() {
  try {
    await connectDB();

    // 1. Total Sales (sum of all pending/delivered/shipped orders, excluding cancelled)
    const salesResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalSalesNum = salesResult.length > 0 ? salesResult[0].total : 0;

    // Formatting currency to e.g LKR 2.4M or LKR 50K
    let formattedSales = `LKR ${(totalSalesNum || 0).toLocaleString()}`;
    if (totalSalesNum >= 1000000) {
      formattedSales = `LKR ${(totalSalesNum / 1000000).toFixed(1)}M`;
    } else if (totalSalesNum >= 1000) {
      formattedSales = `LKR ${(totalSalesNum / 1000).toFixed(1)}K`;
    }

    // 2. Pending Orders
    const pendingOrdersCount = await Order.countDocuments({ status: 'pending' });

    // 3. Active Customers (approximate via Users or unique emails in Orders)
    const activeCustomersCount = await User.countDocuments({ role: { $ne: 'admin' } });

    // 4. In Stock (sum of all iPhone stock, assuming we have a stock field. If not, just count the models)
    // For now we just count how many iPhone listings exist
    const inStockCount = await iPhone.countDocuments();

    // 5. Recent Activity
    // Fetch latest 2 orders, 2 recent offers, and sort them together
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(2);
    const recentOffers = await Offer.find().populate('iPhoneId').sort({ createdAt: -1 }).limit(2);

    const activity = [];
    
    for (const o of recentOrders) {
      activity.push({
        type: 'order',
        date: o.createdAt,
        message: `Customer ${o.customerDetails.name} placed order for LKR ${(o.totalAmount || 0).toLocaleString()}`
      });
    }

    for (const off of recentOffers) {
      activity.push({
        type: 'offer',
        date: off.createdAt,
        message: `${off.discountPercent}% OFF offer created for ${(off.iPhone as any)?.model || 'a product'}`
      });
    }

    // Sort combined activity manually
    activity.sort((a, b) => b.date.getTime() - a.date.getTime());

    return NextResponse.json({
      stats: {
        totalSales: formattedSales,
        activeCustomers: activeCustomersCount,
        inStock: inStockCount,
        pendingOrders: pendingOrdersCount,
      },
      recentActivity: activity.map(a => a.message)
    });
  } catch (error) {
    console.error('Stats fetching error', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
