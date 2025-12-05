import CustomerLayout from '@/Layouts/CustomerLayout';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Voucher {
    id: number;
    code: string;
    stamps_used: number;
    status: string;
    qr_code_data: string;
    expires_at: string;
    created_at: string;
}

interface Props {
    vouchers: Voucher[];
    currentStamps: number;
    content: Record<string, string>;
}

export default function Vouchers({ vouchers, currentStamps, content = {} }: Props) {
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
    const [exchanging, setExchanging] = useState(false);

    const getDaysRemaining = (expiresAt: string) => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diffTime = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleExchangeVoucher = async (stampsToUse: number) => {
        if (currentStamps < stampsToUse) {
            alert(`Kamu hanya punya ${currentStamps} stamps!`);
            return;
        }

        setExchanging(true);
        try {
            router.post('/customer/vouchers/exchange', { stamps: stampsToUse }, {
                onSuccess: () => {
                    alert('Voucher berhasil dibuat!');
                },
                onError: () => {
                    alert('Gagal membuat voucher');
                },
                onFinish: () => {
                    setExchanging(false);
                },
            });
        } catch (error) {
            setExchanging(false);
            alert('Terjadi kesalahan');
        }
    };

    return (
        <CustomerLayout title="Voucher Saya" showBack activeNav="vouchers">
            {/* Header */}
            <div className="bg-white rounded-xl p-4 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Voucher Saya</h2>
                <p className="text-sm text-gray-600">
                    {content.voucher_exchange_info || 'Tukar stamp atau gunakan voucher mu'}
                </p>
            </div>

            {/* Exchange Voucher Section */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 shadow-xl text-white">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm opacity-90">Stamp Kamu</p>
                        <p className="text-3xl font-bold">{currentStamps}</p>
                    </div>
                    <svg className="w-10 h-10 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={() => handleExchangeVoucher(5)}
                        disabled={currentStamps < 5 || exchanging}
                        className="w-full bg-white text-purple-600 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-300 disabled:text-gray-500"
                    >
                        {exchanging ? 'Memproses...' : 'Tukar 5 Stamps → Voucher'}
                    </button>

                    <button
                        onClick={() => handleExchangeVoucher(10)}
                        disabled={currentStamps < 10 || exchanging}
                        className="w-full bg-yellow-400 text-purple-700 font-semibold py-3 rounded-lg hover:bg-yellow-300 transition-colors disabled:bg-gray-300 disabled:text-gray-500"
                    >
                        {exchanging ? 'Memproses...' : 'Tukar 10 Stamps → Voucher Premium'}
                    </button>
                </div>

                <p className="text-xs text-center mt-3 opacity-75">
                    Voucher berlaku untuk produk maksimal Rp 22.000
                </p>
            </div>

            {/* Vouchers List */}
            <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                    Voucher Aktif ({vouchers.filter(v => v.status === 'ACTIVE').length})
                </h3>

                {vouchers.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center shadow-md">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                        <p className="text-gray-500">Belum ada voucher</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {content.voucher_empty_message || 'Tukar stamps kamu untuk dapatkan voucher'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {vouchers.map((voucher) => {
                            const daysLeft = getDaysRemaining(voucher.expires_at);
                            return (
                                <div
                                    key={voucher.id}
                                    className="bg-white rounded-xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-all"
                                    onClick={() => setSelectedVoucher(voucher)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="bg-red-100 p-2 rounded-lg">
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{voucher.code}</p>
                                                <p className="text-xs text-gray-500">
                                                    {voucher.stamps_used} stamps
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                className={`text-xs px-2 py-1 rounded-full font-medium ${daysLeft <= 7
                                                    ? 'bg-red-100 text-red-600'
                                                    : 'bg-green-100 text-green-600'
                                                    }`}
                                            >
                                                {daysLeft} hari lagi
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-400 flex items-center space-x-3">
                                        <span className="flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(voucher.created_at).toLocaleDateString('id-ID')}
                                        </span>
                                        <span className="flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Exp: {new Date(voucher.expires_at).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Voucher QR Modal */}
            {selectedVoucher && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedVoucher(null)}
                >
                    <div
                        className="bg-white rounded-2xl p-6 max-w-sm w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-center mb-4">QR Voucher</h3>

                        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4">
                            <div className="bg-white rounded-xl p-4">
                                <p className="text-center font-mono font-bold text-xl mb-4">
                                    {selectedVoucher.code}
                                </p>

                                <div className="bg-white p-4 rounded-xl mx-auto w-fit border-4 border-gray-100">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(selectedVoucher.qr_code_data)}`}
                                        alt="Voucher QR Code"
                                        className="w-44 h-44"
                                    />
                                </div>

                                <p className="text-center text-sm text-gray-600 mt-4">
                                    Tunjukkan QR ini ke kasir
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedVoucher(null)}
                            className="w-full mt-4 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-semibold"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
