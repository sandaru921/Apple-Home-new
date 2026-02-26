'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Search, Trash2, Shield, ShieldAlert, User as UserIcon, Calendar, MoreVertical, Plus, X } from 'lucide-react';
import { useOverlay } from '@/components/providers/OverlayProvider';
import AdminSidebar from '@/components/AdminSidebar';

interface UserData {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showConfirm, showToast } = useOverlay();

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createData, setCreateData] = useState({ username: '', email: '', password: '', role: 'user' });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && (session?.user as any)?.role !== 'admin')) {
      router.push('/login');
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status]);

  const handleDeleteUser = async (userId: string, username: string) => {
    if (userId === (session?.user as any)?.id) {
       showToast("You cannot delete your own account.", "error");
       return;
    }

    showConfirm({
      title: 'Delete User',
      message: `Are you absolutely sure you want to permanently delete the account for "${username}"? This cannot be undone.`,
      confirmText: 'Delete Account',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
          if (res.ok) {
            showToast(`${username} has been deleted.`, 'success');
            setUsers(users.filter(u => u._id !== userId));
          } else {
            const data = await res.json();
            showToast(data.message || 'Failed to delete user.', 'error');
          }
        } catch (err) {
          showToast('An error occurred while deleting the user.', 'error');
        }
      }
    });
  };

  const handleToggleRole = async (userId: string, currentRole: string, username: string) => {
    if (userId === (session?.user as any)?.id) {
       showToast("You cannot change your own role.", "error");
       return;
    }

    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const actionText = newRole === 'admin' ? 'Promote to Admin' : 'Demote to User';

    showConfirm({
      title: 'Change User Role',
      message: `Are you sure you want to change ${username}'s role to ${newRole.toUpperCase()}?`,
      confirmText: actionText,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
          });
          
          if (res.ok) {
            showToast(`${username} is now a ${newRole}.`, 'success');
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
          } else {
             const data = await res.json();
             showToast(data.message || 'Failed to update role.', 'error');
          }
        } catch (err) {
          showToast('An error occurred.', 'error');
        }
      }
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(`Account for ${createData.username} created successfully!`, 'success');
        setIsCreateModalOpen(false);
        setCreateData({ username: '', email: '', password: '', role: 'user' });
        // The signup route defaults to "user" for N>0, so if we wanted to create an admin
        // we need to immediately run an update on their new record.
        if (createData.role === 'admin') {
           // To keep permissions flawless without massive API rewrites, we fetch the new user from DB by email
           // and run the PUT request instantly. To be secure, let's just refresh the table and let the admin promote them visually.
           showToast('Please find their new account in the table below to promote them to Admin.', 'info');
        }
        fetchUsers();
      } else {
        showToast(data.message || 'Failed to create user.', 'error');
      }
    } catch (err) {
      showToast('An error occurred during account creation.', 'error');
    }
    setCreateLoading(false);
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 border-4 border-[#7CB342] animate-spin rounded-full border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 w-full max-w-[100vw]">
        <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Header spanning exactly the container width */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff & Users</h1>
          <p className="text-gray-500 mt-1">Manage platform access, roles, and accounts.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#7CB342] hover:bg-[#689f38] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" /> Add New User
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
          />
        </div>
      </div>

      {/* Responsive Data View */}
      <div className="w-full">
        {filteredUsers.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center flex flex-col items-center">
            <UserIcon className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">No users found</h3>
            <p className="text-gray-500 max-w-md mx-auto mt-2">Try adjusting your search query, or invite new users to the platform.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 border-t border-t-transparent border-x-transparent">
                      <th className="px-6 py-4 font-bold text-gray-700 uppercase tracking-wider text-xs">User / Email</th>
                      <th className="px-6 py-4 font-bold text-gray-700 uppercase tracking-wider text-xs">Role Level</th>
                      <th className="px-6 py-4 font-bold text-gray-700 uppercase tracking-wider text-xs">Date Joined</th>
                      <th className="px-6 py-4 font-bold text-gray-700 uppercase tracking-wider text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold shadow-inner">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{user.username}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                             user.role === 'admin' 
                              ? 'bg-blue-50 text-blue-700 border-blue-200' 
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                           }`}>
                             {user.role === 'admin' ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                             {user.role.toUpperCase()}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4 text-gray-400" />
                             {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             {user._id !== (session?.user as any)?.id && (
                               <>
                                <button 
                                  onClick={() => handleToggleRole(user._id, user.role, user.username)}
                                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors"
                                >
                                  {user.role === 'admin' ? 'Demote' : 'Promote'}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user._id, user.username)}
                                  className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                  title="Delete Account"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                               </>
                             )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredUsers.map((user) => (
                <div key={user._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative">
                   <div className="flex gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold shadow-inner shrink-0 text-lg">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 pr-6">
                        <h4 className="font-bold text-gray-900 leading-tight">{user.username}</h4>
                        <p className="text-sm text-gray-500 truncate mt-0.5">{user.email}</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-2 mb-4">
                     <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Role</p>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold ${
                           user.role === 'admin' ? 'text-blue-600' : 'text-gray-700'
                        }`}>
                          {user.role === 'admin' ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                          {user.role.toUpperCase()}
                        </span>
                     </div>
                     <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Joined</p>
                        <p className="text-xs font-bold text-gray-700 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                     </div>
                   </div>

                   {/* Mobile Actions */}
                   {user._id !== (session?.user as any)?.id && (
                     <div className="flex gap-2 border-t border-gray-100 pt-4">
                        <button 
                          onClick={() => handleToggleRole(user._id, user.role, user.username)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                            user.role === 'admin' 
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.username)}
                          className="px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                   )}
                   {user._id === (session?.user as any)?.id && (
                     <div className="w-full bg-gray-50 text-center py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-100">
                        Your Account (Protected)
                     </div>
                   )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex justify-center items-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                 <UserIcon className="w-5 h-5 text-[#7CB342]" /> Create User Account
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-500 hover:bg-gray-200 p-2 rounded-full transition-colors">
                 <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={createData.username}
                  onChange={(e) => setCreateData({ ...createData, username: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7CB342] outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={createData.email}
                  onChange={(e) => setCreateData({ ...createData, email: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7CB342] outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={createData.password}
                  onChange={(e) => setCreateData({ ...createData, password: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7CB342] outline-none"
                  placeholder="At least 6 characters"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mt-2">
                 <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                 <p className="text-xs text-blue-800 leading-relaxed">
                   Accounts created here default to the <strong>User</strong> role for security. To grant Administrative privileges, locate the account in the table below and select "Promote" after creation.
                 </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 py-3 bg-[#7CB342] text-white font-bold rounded-xl hover:bg-[#6fa135] transition-colors flex items-center justify-center gap-2"
                >
                  {createLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        </div>
      </main>
    </div>
  );
}
