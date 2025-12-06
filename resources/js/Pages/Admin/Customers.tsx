import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface Customer {
    id: number;
    current_stamps: number;
    total_stamps_earned: number;
    total_stamps_used: number;
    member_since: string;
    user: {
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        member_id: string;
        is_active: boolean;
    };
}

interface Props {
    customers: Customer[];
}

export default function Customers({ customers }: Props) {
    const [search, setSearch] = useState('');
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [adjustData, setAdjustData] = useState({ type: 'add', amount: '', reason: '' });
    const [loading, setLoading] = useState(false);

    const filteredCustomers = customers.filter((c) =>
        c.user.name.toLowerCase().includes(search.toLowerCase()) ||
        c.user.member_id.toLowerCase().includes(search.toLowerCase()) ||
        c.user.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.user.phone?.includes(search)
    );

    const handleAdjustStamp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCustomer) return;

        setLoading(true);
        const amount = parseInt(adjustData.amount);
        const finalAdjustment = adjustData.type === 'add' ? amount : -amount;

        router.post('/admin/customers/adjust-stamp', {
            customer_id: selectedCustomer.id,
            adjustment: finalAdjustment,
            reason: adjustData.reason,
        }, {
            onSuccess: () => {
                setShowAdjustModal(false);
                setAdjustData({ type: 'add', amount: '', reason: '' });
            },
            onError: (errors) => {
                alert('Failed to adjust stamps');
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    const toggleActive = (userId: number, currentStatus: boolean) => {
        if (!confirm(`${currentStatus ? 'Deactivate' : 'Activate'} this customer?`)) return;

        router.post('/admin/customers/toggle-active', {
            user_id: userId,
            is_active: !currentStatus,
        });
    };

    const handleDelete = (customerId: number) => {
        if (!confirm('Hapus customer ini? Data tidak bisa dikembalikan.')) return;

        router.delete(`/admin/customers/${customerId}`, {
            onError: (errors: any) => {
                alert(errors.message || 'Gagal menghapus customer');
            }
        });
    };

    return (
        <AdminLayout title="Customer Management">
            {/* Search */}
            <div className="bg-white rounded-xl p-4 shadow-md mb-4">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari customer (nama, email, phone, member ID)..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl p-4 shadow-md mb-4">
                <p className="text-sm text-gray-600">
                    Total: <span className="font-bold text-gray-800">{filteredCustomers.length}</span> customers
                </p>
            </div>

            {/* Customer List - Mobile Friendly */}
            <div className="space-y-3 md:hidden">
                {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="bg-white rounded-xl p-4 shadow-md">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="bg-emerald-100 p-2 rounded-full">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{customer.user.name}</p>
                                    <p className="text-xs text-gray-500 font-mono">{customer.user.member_id}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${customer.user.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                }`}>
                                {customer.user.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                            {customer.user.email && <p>📧 {customer.user.email}</p>}
                            {customer.user.phone && <p>📞 {customer.user.phone}</p>}
                        </div>

                        <div className="flex items-center justify-between py-2 border-t border-b mb-3">
                            <div className="text-center">
                                <p className="text-lg font-bold text-emerald-600">{customer.current_stamps}</p>
                                <p className="text-xs text-gray-500">Stamps</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-700">{customer.total_stamps_earned}</p>
                                <p className="text-xs text-gray-500">Earned</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-700">{customer.total_stamps_used}</p>
                                <p className="text-xs text-gray-500">Used</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setSelectedCustomer(customer);
                                    setShowAdjustModal(true);
                                }}
                                className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-600 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Adjust Stamps
                            </button>
                            <button
                                onClick={() => toggleActive(customer.user.id, customer.user.is_active)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${customer.user.is_active
                                    ? 'bg-red-50 hover:bg-red-100 text-red-600'
                                    : 'bg-green-50 hover:bg-green-100 text-green-600'
                                    }`}
                            >
                                {customer.user.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                                onClick={() => handleDelete(customer.id)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stamps</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Since</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-emerald-100 p-2 rounded-full">
                                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{customer.user.name}</p>
                                                <p className="text-xs text-gray-500 font-mono">{customer.user.member_id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            {customer.user.email && <p className="text-gray-600">{customer.user.email}</p>}
                                            {customer.user.phone && <p className="text-gray-600">{customer.user.phone}</p>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <p className="font-bold text-emerald-600">{customer.current_stamps} active</p>
                                            <p className="text-xs text-gray-500">
                                                {customer.total_stamps_earned} earned • {customer.total_stamps_used} used
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${customer.user.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {customer.user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(customer.member_since).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedCustomer(customer);
                                                setShowAdjustModal(true);
                                            }}
                                            className="inline-flex items-center px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Adjust Stamps
                                        </button>
                                        <button
                                            onClick={() => handleDelete(customer.id)}
                                            className="inline-flex items-center px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Adjust Modal */}
            {showAdjustModal && selectedCustomer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Adjust Stamps</h2>
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium text-gray-800">{selectedCustomer.user.name}</p>
                            <p className="text-sm text-gray-500">Current: {selectedCustomer.current_stamps} stamps</p>
                        </div>
                        <form onSubmit={handleAdjustStamp} className="space-y-4">
                            {/* Action Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Action *</label>
                                <div className="flex gap-3">
                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="adjustmentType"
                                            value="add"
                                            checked={adjustData.type === 'add'}
                                            onChange={(e) => setAdjustData({ ...adjustData, type: e.target.value })}
                                            className="sr-only peer"
                                        />
                                        <div className="px-4 py-3 border-2 border-gray-300 rounded-lg text-center peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 transition-all">
                                            <span className="font-medium">➕ Add</span>
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="adjustmentType"
                                            value="subtract"
                                            checked={adjustData.type === 'subtract'}
                                            onChange={(e) => setAdjustData({ ...adjustData, type: e.target.value })}
                                            className="sr-only peer"
                                        />
                                        <div className="px-4 py-3 border-2 border-gray-300 rounded-lg text-center peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-700 transition-all">
                                            <span className="font-medium">➖ Subtract</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={adjustData.amount}
                                    onChange={(e) => setAdjustData({ ...adjustData, amount: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                                <textarea
                                    value={adjustData.reason}
                                    onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    rows={3}
                                    placeholder="Explain why..."
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAdjustModal(false);
                                        setAdjustData({ type: 'add', amount: '', reason: '' });
                                    }}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
                                >
                                    {loading ? 'Processing...' : 'Adjust'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
