import CashierLayout from '@/Layouts/CashierLayout';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface VoucherInfo {
    code: string;
    stamps_used: number;
    customer_name: string;
    member_id: string;
}

export default function Redeem() {
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherInfo, setVoucherInfo] = useState<VoucherInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLookup = async () => {
        setError('');
        setSuccess('');

        if (!voucherCode) {
            setError('Kode voucher harus diisi');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/voucher/lookup?code=${voucherCode}`);
            const data = await response.json();

            if (response.ok && data.voucher) {
                setVoucherInfo({
                    code: data.voucher.code,
                    stamps_used: data.voucher.stamps_used,
                    customer_name: data.voucher.customer.user.name,
                    member_id: data.voucher.customer.user.member_id,
                });
                setSuccess('Voucher valid! Silakan konfirmasi penukaran.');
            } else {
                setError(data.message || 'Voucher tidak ditemukan atau sudah digunakan');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mencari voucher');
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async () => {
        if (!voucherInfo) return;

        setLoading(true);
        setError('');

        try {
            router.post('/cashier/redeem', {
                code: voucherInfo.code,
            }, {
                onSuccess: () => {
                    setSuccess(`Voucher ${voucherInfo.code} berhasil ditukar!`);
                    setVoucherInfo(null);
                    setVoucherCode('');

                    setTimeout(() => {
                        setSuccess('');
                    }, 5000);
                },
                onError: (errors: any) => {
                    setError(errors.message || 'Gagal memproses penukaran');
                },
                onFinish: () => {
                    setLoading(false);
                },
            });
        } catch (err) {
            setError('Terjadi kesalahan');
            setLoading(false);
        }
    };

    return (
        <CashierLayout title="Redeem Voucher" showBack>
            {/* Success Message */}
            {success && (
                <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                    <p className="text-green-700 font-semibold text-center">✅ {success}</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Voucher Lookup */}
            <div className="bg-white rounded-xl p-4 shadow-md">
                <h3 className="font-semibold text-gray-800 mb-3">1. Input Kode Voucher</h3>

                {voucherInfo ? (
                    <div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-6 text-center space-y-3">
                        <div className="bg-purple-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-mono font-bold text-xl text-purple-600">{voucherInfo.code}</p>
                            <p className="text-sm text-gray-600">{voucherInfo.stamps_used} stamps</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">Customer</p>
                            <p className="font-bold text-gray-800">{voucherInfo.customer_name}</p>
                            <p className="text-xs text-gray-500 font-mono">{voucherInfo.member_id}</p>
                        </div>
                        <button
                            onClick={() => {
                                setVoucherInfo(null);
                                setVoucherCode('');
                            }}
                            className="text-xs text-purple-600 hover:text-purple-700 underline"
                        >
                            Input voucher lain
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kode Voucher
                            </label>
                            <input
                                type="text"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-lg"
                                placeholder="VCR-XXXXXXXX"
                            />
                        </div>
                        <button
                            onClick={handleLookup}
                            disabled={loading || !voucherCode}
                            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>{loading ? 'Mencari...' : 'Cek Voucher'}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Confirm Redeem */}
            {voucherInfo && (
                <div className="bg-white rounded-xl p-4 shadow-md">
                    <h3 className="font-semibold text-gray-800 mb-3">2. Konfirmasi Penukaran</h3>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-700 mb-2">
                            Customer <span className="font-bold">{voucherInfo.customer_name}</span> menukarkan voucher untuk:
                        </p>
                        <p className="text-lg font-bold text-purple-600">
                            {voucherInfo.stamps_used === 5 ? 'FREE DRINK (max Rp 22.000)' : 'FREE ITEM (max Rp 22.000)'}
                        </p>
                    </div>

                    <button
                        onClick={handleRedeem}
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{loading ? 'Memproses...' : 'Konfirmasi Penukaran'}</span>
                    </button>
                </div>
            )}

            {/* Info */}
            <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">Info:</span> Pastikan voucher masih berlaku sebelum penukaran.
                    Voucher hanya bisa digunakan 1x.
                </p>
            </div>
        </CashierLayout>
    );
}
