import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Popup {
    id: number;
    title: string;
    content: string;
    image_url?: string;
    start_date?: string;
    end_date?: string;
    target_role?: string;
    frequency: string;
    action_label?: string;
    action_url?: string;
    priority: number;
    is_active: boolean;
    views_count?: number;
}

interface Props {
    popups: Popup[];
}

export default function Popups({ popups: initialPopups }: Props) {
    const [popups, setPopups] = useState(initialPopups);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image_url: '',
        start_date: '',
        end_date: '',
        target_role: '',
        frequency: 'ONCE',
        action_label: '',
        action_url: '',
        priority: 0,
        is_active: true,
    });

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            image_url: '',
            start_date: '',
            end_date: '',
            target_role: '',
            frequency: 'ONCE',
            action_label: '',
            action_url: '',
            priority: 0,
            is_active: true,
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (popup: Popup) => {
        setFormData({
            title: popup.title,
            content: popup.content,
            image_url: popup.image_url || '',
            start_date: popup.start_date ? popup.start_date.slice(0, 16) : '',
            end_date: popup.end_date ? popup.end_date.slice(0, 16) : '',
            target_role: popup.target_role || '',
            frequency: popup.frequency,
            action_label: popup.action_label || '',
            action_url: popup.action_url || '',
            priority: popup.priority,
            is_active: popup.is_active,
        });
        setEditingId(popup.id);
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (editingId) {
            router.put(`/admin/popups/${editingId}`, formData, {
                onSuccess: () => resetForm(),
                onFinish: () => setLoading(false),
            });
        } else {
            router.post('/admin/popups', formData, {
                onSuccess: () => resetForm(),
                onFinish: () => setLoading(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (!confirm('Delete this popup?')) return;
        router.delete(`/admin/popups/${id}`);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No limit';
        return new Date(dateString).toLocaleDateString('id-ID');
    };

    if (showForm) {
        return (
            <AdminLayout title={editingId ? 'Edit Popup' : 'Create Popup'}>
                <div className="bg-white rounded-xl shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content (HTML supported) <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                rows={6}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                            <input
                                type="text"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                <input
                                    type="datetime-local"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                <input
                                    type="datetime-local"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
                                <select
                                    value={formData.target_role}
                                    onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="">All Users</option>
                                    <option value="CUSTOMER">Customers Only</option>
                                    <option value="CASHIER">Cashiers Only</option>
                                    <option value="ADMIN">Admins Only</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                                <select
                                    value={formData.frequency}
                                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="ONCE">Show Once</option>
                                    <option value="DAILY">Show Daily</option>
                                    <option value="ALWAYS">Always Show</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Action Button Label</label>
                                <input
                                    type="text"
                                    value={formData.action_label}
                                    onChange={(e) => setFormData({ ...formData, action_label: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="e.g., Shop Now"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Action URL</label>
                                <input
                                    type="text"
                                    value={formData.action_url}
                                    onChange={(e) => setFormData({ ...formData, action_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="/vouchers"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                <input
                                    type="number"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-8">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
                            >
                                {loading ? 'Saving...' : editingId ? 'Update Popup' : 'Create Popup'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Popup Management">
            {/* Add Button */}
            <div className="mb-4">
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Popup</span>
                </button>
            </div>

            {/* Popups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popups.map((popup) => (
                    <div
                        key={popup.id}
                        className={`bg-white rounded-xl shadow-md overflow-hidden ${!popup.is_active ? 'opacity-60' : ''}`}
                    >
                        {popup.image_url && (
                            <div className="h-40 bg-gray-100">
                                <img
                                    src={popup.image_url}
                                    alt={popup.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-lg text-gray-800">{popup.title}</h3>
                                {!popup.is_active && (
                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Inactive</span>
                                )}
                            </div>

                            <div
                                className="text-sm text-gray-600 mb-4 line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: popup.content }}
                            />

                            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                                <div className="flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span>{popup.views_count || 0} views</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{formatDate(popup.end_date)}</span>
                                </div>
                                <span>{popup.target_role || 'All'}</span>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(popup)}
                                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-lg transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(popup.id)}
                                    className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {popups.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        <p>No popups yet. Create your first popup!</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
