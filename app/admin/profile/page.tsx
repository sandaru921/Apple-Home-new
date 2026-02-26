'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, Lock, Save, Loader2, LogOut, CheckCircle } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Redirect to login if unauthenticated or not an admin
  if (status === 'unauthenticated' || (status === 'authenticated' && (session?.user as any)?.role !== 'admin')) {
    router.push('/login');
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#7CB342]" />
      </div>
    );
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: 'Admin Password updated successfully!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ text: data.message || 'Failed to update password.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An unexpected error occurred.', type: 'error' });
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        <div className="max-w-4xl mx-auto w-full">
      <div className="mb-10 text-left">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-500">Manage your administrative details and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: User Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-[#7CB342]/10 text-[#7CB342] rounded-full flex items-center justify-center mb-6">
              <User className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{session?.user?.name}</h2>
            <p className="text-gray-500 text-sm mb-6 flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              {session?.user?.email}
            </p>
            
            <div className="w-full pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-500">Account Type</span>
                <span className="font-bold flex items-center gap-1 text-gray-900 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                   <Shield className="w-3 h-3 text-black" /> 
                   <span className="capitalize">{(session?.user as any)?.role}</span>
                </span>
              </div>
            </div>

            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="mt-6 w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Right Column: Security Settings */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-700">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-500">Ensure your administrative account is using a long, secure password.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7CB342] focus:border-transparent outline-none transition-all"
                  placeholder="Enter current password"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7CB342] focus:border-transparent outline-none transition-all"
                    placeholder="At least 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7CB342] focus:border-transparent outline-none transition-all"
                    placeholder="Re-type new password"
                  />
                </div>
              </div>

              {message.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                  message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
                  {message.text}
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
      </main>
    </div>
  );
}
