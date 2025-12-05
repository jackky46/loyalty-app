import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';

interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    content: string;
    is_active: boolean;
}

interface Props {
    templates: EmailTemplate[];
}

const predefinedTemplates = [
    { name: 'welcome', label: 'Welcome Email' },
    { name: 'stamp_earned', label: 'Stamp Earned' },
    { name: 'voucher_redeemed', label: 'Voucher Redeemed' },
    { name: 'birthday_reward', label: 'Birthday Reward' },
    { name: 'promo_announcement', label: 'Promo Announcement' },
];

const availableVariables = [
    { key: 'name', description: 'Customer name' },
    { key: 'member_id', description: 'Member ID' },
    { key: 'stamps', description: 'Number of stamps' },
    { key: 'voucher_name', description: 'Voucher name' },
    { key: 'expiry_date', description: 'Expiry date' },
];

export default function EmailTemplates({ templates }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);

    const { data, setData, post, put, processing, reset } = useForm({
        name: '',
        subject: '',
        content: '',
        is_active: true,
    });

    const handleCreate = () => {
        setEditingTemplate(null);
        reset();
        setShowModal(true);
    };

    const handleEdit = (template: EmailTemplate) => {
        setEditingTemplate(template);
        setData({
            name: template.name,
            subject: template.subject,
            content: template.content,
            is_active: template.is_active,
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTemplate) {
            put(`/admin/email-templates/${editingTemplate.id}`, {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post('/admin/email-templates', {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (!confirm('Delete this template?')) return;
        router.delete(`/admin/email-templates/${id}`);
    };

    const handlePreview = async () => {
        try {
            const res = await fetch('/admin/email-templates/preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ subject: data.subject, content: data.content }),
            });
            const result = await res.json();
            setPreviewHtml(result.content);
        } catch (err) {
            console.error(err);
        }
    };

    const insertVariable = (variable: string) => {
        setData('content', data.content + `{{${variable}}}`);
    };

    return (
        <AdminLayout title="Email Templates">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Manage Email Templates</h2>
                    <p className="text-sm text-gray-500">Customize emails sent to customers</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Template</span>
                </button>
            </div>

            {/* Templates List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                    <div key={template.id} className="bg-white rounded-xl shadow-md p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-bold text-gray-800">{template.name}</h3>
                                <p className="text-sm text-gray-500 truncate max-w-xs">{template.subject}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${template.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {template.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="text-xs text-gray-400 h-16 overflow-hidden mb-3">
                            {template.content.replace(/<[^>]*>/g, '').slice(0, 150)}...
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(template)}
                                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg font-medium text-sm"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(template.id)}
                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {templates.length === 0 && (
                    <div className="col-span-2 bg-white rounded-xl shadow-md p-12 text-center">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 mb-4">No email templates yet</p>
                        <button
                            onClick={handleCreate}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium"
                        >
                            Create First Template
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingTemplate ? 'Edit Template' : 'Create Template'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                                    <select
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        required
                                    >
                                        <option value="">Select template type</option>
                                        {predefinedTemplates.map((t) => (
                                            <option key={t.name} value={t.name}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center pt-6">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded"
                                    />
                                    <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">Active</label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Email subject..."
                                    required
                                />
                            </div>

                            {/* Variables Helper */}
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-600 mb-2">Available Variables (click to insert):</p>
                                <div className="flex flex-wrap gap-2">
                                    {availableVariables.map((v) => (
                                        <button
                                            key={v.key}
                                            type="button"
                                            onClick={() => insertVariable(v.key)}
                                            className="bg-white border px-2 py-1 rounded text-xs hover:bg-gray-100"
                                            title={v.description}
                                        >
                                            {`{{${v.key}}}`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML)</label>
                                <textarea
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                                    rows={10}
                                    placeholder="<h1>Hello {{name}}</h1>..."
                                    required
                                />
                            </div>

                            {/* Preview */}
                            {previewHtml && (
                                <div className="border rounded-lg p-4 bg-white">
                                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handlePreview}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
                                >
                                    Preview
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg"
                                >
                                    {processing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
