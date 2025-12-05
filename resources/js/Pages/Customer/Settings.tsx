import CustomerLayout from '@/Layouts/CustomerLayout';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function Settings() {
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/password', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowPasswordModal(false);
                alert('Password berhasil diubah!');
            },
        });
    };

    return (
        <CustomerLayout title="Pengaturan" showBack activeNav="profile">
            {/* Header */}
            <div className="bg-white rounded-xl p-4 shadow-md">
                <h2 className="text-xl font-bold text-gray-800">Pengaturan</h2>
                <p className="text-sm text-gray-600">Kelola akun dan preferensi kamu</p>
            </div>

            {/* Account Section */}
            <div className="bg-white rounded-xl shadow-md divide-y">
                <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                >
                    <div className="bg-gray-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="font-medium text-gray-800">Ganti Password</p>
                        <p className="text-xs text-gray-500">Ubah password akun kamu</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">Tips:</span> Gunakan password yang kuat dengan kombinasi huruf, angka, dan simbol.
                </p>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Ganti Password</h3>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password Lama *
                                </label>
                                <input
                                    type="password"
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />
                                {errors.current_password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.current_password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password Baru *
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    minLength={8}
                                    required
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Konfirmasi Password Baru *
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    minLength={8}
                                    required
                                />
                                {errors.password_confirmation && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        reset();
                                    }}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
