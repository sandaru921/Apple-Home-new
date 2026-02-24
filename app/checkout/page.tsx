'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('appleHomeCart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      setCart(parsed);
      const total = parsed.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
      setSubtotal(total);
    }
  }, []);

  const shipping = subtotal > 50000 ? 0 : 1500;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formattedItems = cart.map(item => ({
        productId: item._id,
        model: item.model,
        price: item.price,
        quantity: item.quantity,
        color: item.selectedColor,
        storage: item.selectedStorage
      }));

      const payload = {
        customerDetails: formData,
        items: formattedItems,
        totalAmount: total
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        localStorage.removeItem('appleHomeCart');
        alert('Order placed successfully! Redirecting...');
        window.dispatchEvent(new Event('cartUpdated'));
        router.push('/shop');
      } else {
        alert('Failed to place order.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="pt-32 text-center text-gray-500 min-h-screen">
          Your cart is empty. Please add items before checking out.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-28 min-h-screen bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row gap-10">
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input required type="text" className="mt-1 w-full p-3 border rounded-xl"
                  onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input required type="email" className="mt-1 w-full p-3 border rounded-xl"
                  onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input required type="tel" className="mt-1 w-full p-3 border rounded-xl"
                  onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                <textarea required className="mt-1 w-full p-3 border rounded-xl" rows={3}
                  onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              
              <button 
                disabled={isSubmitting}
                className="w-full mt-6 bg-[#7CB342] text-white py-4 rounded-xl font-bold hover:bg-[#6fa135] disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-2xl h-fit">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            {cart.map(item => (
              <div key={item.cartItemId || item._id} className="flex justify-between text-sm mb-2">
                <span>
                  {item.quantity}x {item.model}
                  {(item.selectedStorage || item.selectedColor) && (
                    <span className="text-gray-400 text-xs ml-1 block mt-0.5">
                      {item.selectedStorage} {item.selectedColor}
                    </span>
                  )}
                </span>
                <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <hr className="my-4 border-gray-200" />
            <div className="flex justify-between text-sm mb-2 text-gray-600">
              <span>Subtotal</span>
              <span>LKR {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-4 text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `LKR ${shipping}`}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-[#7CB342]">LKR {total.toLocaleString()}</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
