import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

interface ContentBlock {
    id: number;
    key: string;
    category: string;
    title: string | null;
    content: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    contents: ContentBlock[];
    categories: string[];
    filters: {
        category: string;
        search: string;
    };
}

export default function Content({ contents, categories, filters }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editingContent, setEditingContent] = useState<ContentBlock | null>(null);
    const [filterCategory, setFilterCategory] = useState(filters.category);
    const [searchQuery, setSearchQuery] = useState(filters.search);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        key: '',
        category: 'home',
        title: '',
        content: '',
        is_active: true,
    });

    const predefinedCategories = ['home', 'voucher', 'profile', 'qr', 'info', 'tips', 'promo', 'cashier', 'faq'];

    const openCreateModal = () => {
        reset();
        setEditingContent(null);
        setShowModal(true);
    };

    // Ref for the contentEditable div
    const contentEditableRef = useRef<HTMLDivElement>(null);

    // Sync contentEditable content when modal opens or when editing
    useEffect(() => {
        if (showModal && contentEditableRef.current) {
            contentEditableRef.current.innerHTML = data.content;
        }
    }, [showModal, editingContent]);

    const openEditModal = (content: ContentBlock) => {
        setEditingContent(content);
        setData({
            key: content.key,
            category: content.category,
            title: content.title || '',
            content: content.content,
            is_active: content.is_active,
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingContent) {
            put(`/admin/content/${editingContent.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post('/admin/content', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus content ini?')) {
            router.delete(`/admin/content/${id}`);
        }
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/content/${id}/toggle`);
    };

    const handleFilter = () => {
        router.get('/admin/content', {
            category: filterCategory,
            search: searchQuery,
        }, { preserveState: true });
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            home: 'bg-blue-100 text-blue-700',
            voucher: 'bg-purple-100 text-purple-700',
            profile: 'bg-green-100 text-green-700',
            qr: 'bg-orange-100 text-orange-700',
            info: 'bg-cyan-100 text-cyan-700',
            tips: 'bg-yellow-100 text-yellow-700',
            promo: 'bg-pink-100 text-pink-700',
        };
        return colors[category] || 'bg-gray-100 text-gray-700';
    };

    return (
        <>
            <Head title="Content Manager - Admin" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 shadow-lg">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Link href="/admin/dashboard" className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                                <div>
                                    <h1 className="text-xl font-bold">Content Manager</h1>
                                    <p className="text-sm text-emerald-100">Kelola semua konten customer</p>
                                </div>
                            </div>
                            <button
                                onClick={openCreateModal}
                                className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Tambah Content</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="max-w-6xl mx-auto p-4 space-y-4">
                    {/* Filters */}
                    <div className="bg-white rounded-xl p-4 shadow-md">
                        <div className="flex flex-wrap gap-3">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="all">Semua Kategori</option>
                                {predefinedCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Cari content..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            />
                            <button
                                onClick={handleFilter}
                                className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                            >
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Content List */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left p-4 font-semibold text-gray-700">Key</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">Kategori</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">Title</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">Content</th>
                                        <th className="text-center p-4 font-semibold text-gray-700">Status</th>
                                        <th className="text-center p-4 font-semibold text-gray-700">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {contents.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-gray-500">
                                                Belum ada content. Klik "Tambah Content" untuk mulai.
                                            </td>
                                        </tr>
                                    ) : (
                                        contents.map((content) => (
                                            <tr key={content.id} className="hover:bg-gray-50">
                                                <td className="p-4">
                                                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{content.key}</code>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(content.category)}`}>
                                                        {content.category}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-800">{content.title || '-'}</td>
                                                <td className="p-4 text-gray-600 max-w-xs truncate">{content.content}</td>
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() => handleToggleActive(content.id)}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${content.is_active
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}
                                                    >
                                                        {content.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </button>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button
                                                            onClick={() => openEditModal(content)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(content.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">💡 Tips Penggunaan</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• <strong>Key</strong>: Identifier unik untuk content (contoh: home_tips, voucher_info)</li>
                            <li>• <strong>Kategori</strong>: Untuk mengelompokkan content berdasarkan halaman</li>
                            <li>• Content yang dinonaktifkan tidak akan tampil di customer</li>
                        </ul>

                        <h4 className="font-semibold text-gray-800 mt-4 mb-2">📋 Key yang Digunakan di Customer App:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div className="bg-white p-2 rounded border">
                                <code className="text-blue-600">promo_banner_text</code>
                                <p className="text-xs text-gray-500">Banner promo di dashboard (kategori: home/promo)</p>
                            </div>
                            <div className="bg-white p-2 rounded border">
                                <code className="text-blue-600">home_stamp_info</code>
                                <p className="text-xs text-gray-500">Info di kartu stamp (kategori: home)</p>
                            </div>
                            <div className="bg-white p-2 rounded border">
                                <code className="text-blue-600">cashier_announcement</code>
                                <p className="text-xs text-gray-500">Pengumuman di dashboard kasir (kategori: cashier)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingContent ? 'Edit Content' : 'Tambah Content Baru'}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Key *</label>
                                <input
                                    type="text"
                                    value={data.key}
                                    onChange={(e) => setData('key', e.target.value.toLowerCase().replace(/\s/g, '_'))}
                                    placeholder="contoh: home_tips"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    required
                                />
                                {errors.key && <p className="text-red-500 text-xs mt-1">{errors.key}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    required
                                >
                                    {predefinedCategories.map((cat) => (
                                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul (opsional)</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Judul content"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                                {/* Rich Text Toolbar */}
                                <div className="flex gap-1 mb-2 p-1 bg-gray-100 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => document.execCommand('bold')}
                                        className="p-2 hover:bg-gray-200 rounded font-bold"
                                        title="Bold"
                                    >B</button>
                                    <button
                                        type="button"
                                        onClick={() => document.execCommand('italic')}
                                        className="p-2 hover:bg-gray-200 rounded italic"
                                        title="Italic"
                                    >I</button>
                                    <button
                                        type="button"
                                        onClick={() => document.execCommand('underline')}
                                        className="p-2 hover:bg-gray-200 rounded underline"
                                        title="Underline"
                                    >U</button>
                                    <div className="w-px bg-gray-300 mx-1"></div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const url = prompt('Masukkan URL:');
                                            if (url) document.execCommand('createLink', false, url);
                                        }}
                                        className="p-2 hover:bg-gray-200 rounded text-blue-600"
                                        title="Link"
                                    >🔗</button>
                                    <button
                                        type="button"
                                        onClick={() => document.execCommand('insertUnorderedList')}
                                        className="p-2 hover:bg-gray-200 rounded"
                                        title="Bullet List"
                                    >•</button>
                                </div>
                                <div
                                    ref={contentEditableRef}
                                    contentEditable
                                    className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                                    onBlur={(e) => setData('content', (e.target as HTMLDivElement).innerHTML)}
                                />
                                <p className="text-xs text-gray-500 mt-1">Gunakan toolbar untuk format teks (bold, italic, dll)</p>
                                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                />
                                <label htmlFor="is_active" className="text-sm text-gray-700">Aktifkan content ini</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Content Keys Reference */}
            <div className="bg-white rounded-xl shadow-md mt-6">
                <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="font-bold text-gray-800 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Panduan Content Keys
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Copy key yang ingin digunakan dan paste saat membuat content baru</p>
                </div>
                <div className="p-4 space-y-4 text-sm">
                    {/* Home Category */}
                    <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-bold text-red-600 mb-2">📱 Category: home (Customer Dashboard)</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 font-medium">Key</th>
                                        <th className="px-3 py-2 font-medium">Lokasi</th>
                                        <th className="px-3 py-2 font-medium">Contoh Content</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-3 py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">tips_title</code></td>
                                        <td className="px-3 py-2 text-gray-600">Judul section Tips di Dashboard</td>
                                        <td className="px-3 py-2 text-gray-500 italic">Tips & Info</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">tips_content</code></td>
                                        <td className="px-3 py-2 text-gray-600">Isi tips di Dashboard</td>
                                        <td className="px-3 py-2 text-gray-500 italic">Kumpulkan stamp dan tukarkan dengan produk favorit!</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">stamp_info</code></td>
                                        <td className="px-3 py-2 text-gray-600">Info cara dapat stamp</td>
                                        <td className="px-3 py-2 text-gray-500 italic">Belanja minimal Rp15.000 = 1 stamp</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">reward_info</code></td>
                                        <td className="px-3 py-2 text-gray-600">Info tukar stamp</td>
                                        <td className="px-3 py-2 text-gray-500 italic">5 stamp = Produk kecil, 10 stamp = Produk besar</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Promo Category */}
                    <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-bold text-purple-600 mb-2">🎉 Category: promo (Promo Banner)</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 font-medium">Key</th>
                                        <th className="px-3 py-2 font-medium">Lokasi</th>
                                        <th className="px-3 py-2 font-medium">Contoh Content</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-3 py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">promo_banner_text</code></td>
                                        <td className="px-3 py-2 text-gray-600">Banner promo di Customer Dashboard (atas)</td>
                                        <td className="px-3 py-2 text-gray-500 italic">&lt;b&gt;PROMO!&lt;/b&gt; Beli 2 Gratis 1 sampai 31 Des!</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Voucher Category */}
                    <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-bold text-green-600 mb-2">🎟️ Category: voucher (Halaman Voucher)</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 font-medium">Key</th>
                                        <th className="px-3 py-2 font-medium">Lokasi</th>
                                        <th className="px-3 py-2 font-medium">Contoh Content</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-3 py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">voucher_exchange_info</code></td>
                                        <td className="px-3 py-2 text-gray-600">Info penukaran di halaman Voucher</td>
                                        <td className="px-3 py-2 text-gray-500 italic">Tukarkan stamp Anda dengan produk gratis!</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">voucher_empty_message</code></td>
                                        <td className="px-3 py-2 text-gray-600">Pesan ketika belum punya voucher</td>
                                        <td className="px-3 py-2 text-gray-500 italic">Belum ada voucher. Kumpulkan stamp dulu yuk!</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Profile Category */}
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-bold text-blue-600 mb-2">👤 Category: profile (Halaman Profile)</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 font-medium">Key</th>
                                        <th className="px-3 py-2 font-medium">Lokasi</th>
                                        <th className="px-3 py-2 font-medium">Contoh Content</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-3 py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">profile_member_benefits</code></td>
                                        <td className="px-3 py-2 text-gray-600">Keuntungan member di Profile</td>
                                        <td className="px-3 py-2 text-gray-500 italic">&lt;ul&gt;&lt;li&gt;Gratis produk&lt;/li&gt;&lt;li&gt;Bonus birthday&lt;/li&gt;&lt;/ul&gt;</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* QR Category */}
                    <div className="border-l-4 border-yellow-500 pl-4">
                        <h4 className="font-bold text-yellow-600 mb-2">📱 Category: qr (Halaman QR Code)</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 font-medium">Key</th>
                                        <th className="px-3 py-2 font-medium">Lokasi</th>
                                        <th className="px-3 py-2 font-medium">Contoh Content</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-3 py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">qr_instruction</code></td>
                                        <td className="px-3 py-2 text-gray-600">Instruksi di halaman QR</td>
                                        <td className="px-3 py-2 text-gray-500 italic">Tunjukkan QR ini ke kasir untuk mendapat stamp</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">qr_scan_tips</code></td>
                                        <td className="px-3 py-2 text-gray-600">Tips scan QR</td>
                                        <td className="px-3 py-2 text-gray-500 italic">Pastikan layar terang dan QR jelas terlihat</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* FAQ Category */}
                    <div className="border-l-4 border-pink-500 pl-4">
                        <h4 className="font-bold text-pink-600 mb-2">❓ Category: faq (Halaman FAQ/Bantuan)</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 font-medium">Key</th>
                                        <th className="px-3 py-2 font-medium">Lokasi</th>
                                        <th className="px-3 py-2 font-medium">Contoh</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-3 py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">faq_1</code></td>
                                        <td className="px-3 py-2 text-gray-600">FAQ item (Title = Pertanyaan)</td>
                                        <td className="px-3 py-2 text-gray-500 italic">Title: Bagaimana cara dapat stamp? Content: Belanja min Rp15.000...</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">faq_2, faq_3...</code></td>
                                        <td className="px-3 py-2 text-gray-600">FAQ item lainnya</td>
                                        <td className="px-3 py-2 text-gray-500 italic">Buat sebanyak yang dibutuhkan</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 bg-pink-50 p-2 rounded">
                            💡 <strong>Tips FAQ:</strong> Gunakan Title untuk pertanyaan dan Content untuk jawaban. Semua content dengan category "faq" akan otomatis muncul di halaman Bantuan & FAQ customer.
                        </p>
                    </div>

                    {/* Cashier Category */}
                    <div className="border-l-4 border-orange-500 pl-4">
                        <h4 className="font-bold text-orange-600 mb-2">💰 Category: cashier (Dashboard Kasir)</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 font-medium">Key</th>
                                        <th className="px-3 py-2 font-medium">Lokasi</th>
                                        <th className="px-3 py-2 font-medium">Contoh Content</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-3 py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">cashier_announcement</code></td>
                                        <td className="px-3 py-2 text-gray-600">Pengumuman di Dashboard Kasir</td>
                                        <td className="px-3 py-2 text-gray-500 italic">&lt;b&gt;Reminder:&lt;/b&gt; Jangan lupa scan QR customer!</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* HTML Tips */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mt-4">
                        <h4 className="font-bold text-gray-800 mb-2">📝 Tips Format HTML</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                                <p className="font-medium mb-1">Bold & Italic:</p>
                                <code className="bg-white px-2 py-1 rounded block">&lt;b&gt;Tebal&lt;/b&gt; &lt;i&gt;Miring&lt;/i&gt;</code>
                            </div>
                            <div>
                                <p className="font-medium mb-1">List:</p>
                                <code className="bg-white px-2 py-1 rounded block">&lt;ul&gt;&lt;li&gt;Item 1&lt;/li&gt;&lt;li&gt;Item 2&lt;/li&gt;&lt;/ul&gt;</code>
                            </div>
                            <div>
                                <p className="font-medium mb-1">Link:</p>
                                <code className="bg-white px-2 py-1 rounded block">&lt;a href="url"&gt;Klik di sini&lt;/a&gt;</code>
                            </div>
                            <div>
                                <p className="font-medium mb-1">Warna:</p>
                                <code className="bg-white px-2 py-1 rounded block">&lt;span style="color:red"&gt;Merah&lt;/span&gt;</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
