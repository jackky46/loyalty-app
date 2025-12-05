import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Props {
    customers?: { id: number; name: string }[];
}

export default function Notifications({ customers = [] }: Props) {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info',
        action_url: '',
        image_url: '',
        target_type: 'broadcast',
        user_id: '',
        target_role: 'CUSTOMER',
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        router.post('/admin/notifications', formData, {
            onSuccess: () => {
                setResult({ success: true, message: 'Notification sent successfully!' });
                setFormData({
                    title: '',
                    message: '',
                    type: 'info',
                    action_url: '',
                    image_url: '',
                    target_type: 'broadcast',
                    user_id: '',
                    target_role: 'CUSTOMER',
                });
            },
            onError: () => {
                setResult({ success: false, message: 'Failed to send notification' });
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AdminLayout title="Notifications">
            {/* Result Message */}
            {result && (
                <div className={`mb-6 p-4 rounded-lg ${result.success
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                    <p className="font-medium">{result.message}</p>
                </div>
            )}

            {/* Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Target Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Target Audience
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, target_type: 'broadcast' })}
                                className={`p-3 rounded-lg border-2 transition-all ${formData.target_type === 'broadcast'
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <svg className="w-6 h-6 mx-auto mb-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="text-sm font-medium">All Users</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, target_type: 'role' })}
                                className={`p-3 rounded-lg border-2 transition-all ${formData.target_type === 'role'
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <svg className="w-6 h-6 mx-auto mb-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <p className="text-sm font-medium">By Role</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, target_type: 'specific' })}
                                className={`p-3 rounded-lg border-2 transition-all ${formData.target_type === 'specific'
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <svg className="w-6 h-6 mx-auto mb-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <p className="text-sm font-medium">Specific User</p>
                            </button>
                        </div>
                    </div>

                    {/* Role Selection */}
                    {formData.target_type === 'role' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
                            <select
                                value={formData.target_role}
                                onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="CUSTOMER">All Customers</option>
                                <option value="CASHIER">All Cashiers</option>
                                <option value="MANAGER">All Managers</option>
                                <option value="ADMIN">All Admins</option>
                            </select>
                        </div>
                    )}

                    {/* User ID */}
                    {formData.target_type === 'specific' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                            <input
                                type="number"
                                value={formData.user_id}
                                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                placeholder="Enter user ID"
                                required={formData.target_type === 'specific'}
                            />
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            placeholder="e.g., Flash Sale Today!"
                            required
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            rows={4}
                            placeholder="Enter notification message..."
                            required
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="info">Info (ℹ️)</option>
                            <option value="success">Success (✓)</option>
                            <option value="warning">Warning (⚠️)</option>
                            <option value="promo">Promo (🎉)</option>
                            <option value="birthday">Birthday (🎂)</option>
                        </select>
                    </div>

                    {/* Action URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Action URL (Optional)</label>
                        <input
                            type="text"
                            value={formData.action_url}
                            onChange={(e) => setFormData({ ...formData, action_url: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            placeholder="/vouchers, /dashboard, etc."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>{loading ? 'Sending...' : 'Send Notification'}</span>
                    </button>
                </form>
            </div>

            {/* Tips */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Tips:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use <strong>Broadcast</strong> to send to all users</li>
                    <li>• Use <strong>By Role</strong> to target specific user groups</li>
                    <li>• Use <strong>Specific User</strong> for individual notifications</li>
                    <li>• Action URLs help users navigate directly to relevant pages</li>
                </ul>
            </div>
        </AdminLayout>
    );
}
