import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        member_id: string;
        phone?: string;
        birth_date?: string;
        profile_photo?: string;
        created_at: string;
    };
    customer: {
        current_stamps: number;
        total_stamps_earned: number;
        total_stamps_used: number;
    } | null;
    birthdayRewardStamps: number;
    birthdayRewardClaimed: boolean;
}

export default function Profile({ user, customer, birthdayRewardStamps, birthdayRewardClaimed }: Props) {
    const memberSince = new Date(user.created_at).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
    });

    const [showBirthdayModal, setShowBirthdayModal] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        birth_date: user.birth_date || '',
    });

    const handleBirthdaySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/customer/birthday', {
            onSuccess: () => {
                setShowBirthdayModal(false);
            },
        });
    };

    const canGetReward = !user.birth_date && !birthdayRewardClaimed && birthdayRewardStamps > 0;

    return (
        <CustomerLayout title="Profile" showBack activeNav="profile">
            {/* Profile Header with Photo (read-only) */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 shadow-xl text-white">
                <div className="flex items-center space-x-4">
                    {/* Profile Photo - Display only */}
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20 border-2 border-white/40">
                        {user.profile_photo ? (
                            <img
                                src={user.profile_photo}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p className="text-sm opacity-90">Member Mixue</p>
                    </div>
                </div>

                <div className="mt-4 bg-white/10 backdrop-blur rounded-lg p-3">
                    <p className="text-xs opacity-75 mb-1">Member ID</p>
                    <p className="font-mono font-bold text-lg">{user.member_id}</p>
                </div>
            </div>

            {/* Birthday Reward Banner */}
            {canGetReward && (
                <button
                    onClick={() => setShowBirthdayModal(true)}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 shadow-lg text-white flex items-center justify-between hover:shadow-xl transition-all"
                >
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="font-bold">🎂 Bonus {birthdayRewardStamps} Stamps!</p>
                            <p className="text-xs opacity-90">Tambahkan tanggal lahir untuk dapat bonus</p>
                        </div>
                    </div>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Account Info */}
            <div className="bg-white rounded-xl shadow-md">
                <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-800">Informasi Akun</h3>
                </div>

                <div className="divide-y">
                    <div className="p-4 flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium text-gray-800">{user.email || 'Tidak ada'}</p>
                        </div>
                    </div>

                    <div className="p-4 flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500">Nomor HP</p>
                            <p className="font-medium text-gray-800">{user.phone || 'Tidak ada'}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowBirthdayModal(true)}
                        className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left"
                    >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500">Tanggal Lahir</p>
                            <p className="font-medium text-gray-800">
                                {user.birth_date
                                    ? new Date(user.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                    : <span className="text-orange-600">Belum diisi</span>
                                }
                            </p>
                        </div>
                        {canGetReward && (
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
                                +{birthdayRewardStamps} stamp
                            </span>
                        )}
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div className="p-4 flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500">Status Member</p>
                            <p className="font-medium text-green-600">Aktif</p>
                        </div>
                    </div>

                    <div className="p-4 flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500">Member Sejak</p>
                            <p className="font-medium text-gray-800">{memberSince}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            {customer && (
                <div className="bg-white rounded-xl p-4 shadow-md">
                    <h3 className="font-semibold text-gray-800 mb-3">Ringkasan Aktivitas</h3>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="bg-red-50 rounded-lg p-3 mb-2">
                                <p className="text-2xl font-bold text-red-600">
                                    {customer.total_stamps_earned}
                                </p>
                            </div>
                            <p className="text-xs text-gray-500">Total Stamps</p>
                        </div>

                        <div>
                            <div className="bg-purple-50 rounded-lg p-3 mb-2">
                                <p className="text-2xl font-bold text-purple-600">
                                    {customer.total_stamps_used}
                                </p>
                            </div>
                            <p className="text-xs text-gray-500">Ditukarkan</p>
                        </div>

                        <div>
                            <div className="bg-blue-50 rounded-lg p-3 mb-2">
                                <p className="text-2xl font-bold text-blue-600">
                                    {customer.current_stamps}
                                </p>
                            </div>
                            <p className="text-xs text-gray-500">Tersedia</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-md divide-y">
                <Link
                    href="/profile"
                    className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="flex-1 text-left font-medium text-gray-800">Edit Profile</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>

                <Link
                    href="/customer/settings"
                    className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="flex-1 text-left font-medium text-gray-800">Pengaturan</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>

                <Link
                    href="/customer/faq"
                    className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="flex-1 text-left font-medium text-gray-800">Bantuan & FAQ</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>

                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="w-full p-4 flex items-center space-x-3 hover:bg-red-50 transition-colors text-red-600"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="flex-1 text-left font-medium">Keluar</span>
                </Link>
            </div>

            {/* Birthday Modal */}
            {showBirthdayModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
                        <div className="text-center mb-4">
                            <div className="text-4xl mb-2">🎂</div>
                            <h3 className="text-lg font-bold text-gray-800">Tanggal Lahir</h3>
                            {canGetReward && (
                                <p className="text-sm text-orange-600 font-medium">
                                    Bonus {birthdayRewardStamps} stamp untuk kamu!
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleBirthdaySubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pilih Tanggal Lahir
                                </label>
                                <input
                                    type="date"
                                    value={data.birth_date}
                                    onChange={(e) => setData('birth_date', e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />
                                {errors.birth_date && (
                                    <p className="text-red-500 text-xs mt-1">{errors.birth_date}</p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowBirthdayModal(false)}
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
