export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

export async function GET() {
  try {
    await connectDB();

    // Aggregate unique customers from the Order model
    const customerAggregations = await Order.aggregate([
      {
        $group: {
          _id: '$customerDetails.email',
          name: { $first: '$customerDetails.name' },
          joined: { $min: '$createdAt' },
          orders: { $sum: 1 },
          spent: {
            $sum: {
              $cond: [{ $ne: ['$status', 'cancelled'] }, '$totalAmount', 0]
            }
          }
        }
      }
    ]);

    // Format and assign loyalty tiers
    const customers = customerAggregations.map(c => {
      let loyalty = 'Bronze';
      if (c.spent >= 2000000) loyalty = 'Gold';
      else if (c.spent >= 1000000) loyalty = 'Silver';

      return {
        _id: c._id, // use email as unique UI ID
        name: c.name || 'Unknown',
        email: c._id,
        orders: c.orders,
        spent: c.spent,
        joined: new Date(c.joined).toISOString().split('T')[0],
        loyalty
      };
    });

    // Sort by most spent
    customers.sort((a, b) => b.spent - a.spent);

    return NextResponse.json({ customers });
  } catch (err) {
    console.error('Error fetching customers:', err);
    return NextResponse.json({ error: 'Failed to fetch customer aggregations' }, { status: 500 });
  }
}
