import CashierLayout from '@/Layouts/CashierLayout';
import { QRScanner } from '@/Components/QRScanner';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface CustomerInfo {
    name: string;
    member_id: string;
    current_stamps: number;
}

interface Props {
    locationId: number;
}

export default function Scan({ locationId }: Props) {
    const [inputMode, setInputMode] = useState<'scan' | 'manual'>('scan');
    const [scannedCustomer, setScannedCustomer] = useState<CustomerInfo | null>(null);
    const [manualMemberId, setManualMemberId] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const formatMemberId = (input: string): string => {
        // Remove non-alphanumeric
        let value = input.toUpperCase().replace(/[^A-Z0-9]/g, '');

        // Detect format type
        if (value.startsWith('MXUHCI')) {
            // New format: MXU-HCI-YYYY-XXXXX
            if (value.length > 3) {
                value = value.slice(0, 3) + '-' + value.slice(3); // MXU-
            }
            if (value.length > 7) {
                value = value.slice(0, 7) + '-' + value.slice(7); // MXU-HCI-
            }
            if (value.length > 12) {
                value = value.slice(0, 12) + '-' + value.slice(12); // MXU-HCI-YYYY-
            }
            return value.slice(0, 18); // MXU-HCI-YYYY-XXXXX (18 chars)
        } else if (value.startsWith('MXU')) {
            // Old format: MXU-YYYY-XXXXX
            if (value.length > 3) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            }
            if (value.length > 8) {
                value = value.slice(0, 8) + '-' + value.slice(8);
            }
            return value.slice(0, 14);
        } else {
            // Other formats (MBR, ADM, CSH, etc) - no formatting
            return value;
        }
    };

    const handleManualLookup = async () => {
        setError('');
        setSuccess('');

        if (!manualMemberId) {
            setError('Member ID harus diisi');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/customer/lookup?member_id=${manualMemberId}`);
            const data = await response.json();

            if (response.ok && data.customer) {
                setScannedCustomer({
                    name: data.customer.user.name,
                    member_id: data.customer.user.member_id,
                    current_stamps: data.customer.current_stamps,
                });
                setSuccess('Customer ditemukan! Silakan input jumlah belanja.');
            } else {
                setError(data.message || 'Customer tidak ditemukan');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mencari customer');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!scannedCustomer) {
            setError('Lookup customer terlebih dahulu');
            return;
        }

        const amountNum = parseInt(amount);
        if (!amountNum || amountNum < 15000) {
            setError('Minimal transaksi Rp 15.000');
            return;
        }

        setLoading(true);

        try {
            router.post('/cashier/transaction', {
                member_id: scannedCustomer.member_id,
                amount: amountNum,
            }, {
                onSuccess: () => {
                    setSuccess(`Transaksi berhasil! ${scannedCustomer.name} mendapat +1 stamp`);
                    setAmount('');
                    setScannedCustomer(null);
                    setManualMemberId('');

                    setTimeout(() => {
                        setSuccess('');
                    }, 5000);
                },
                onError: (errors: any) => {
                    setError(errors.message || 'Gagal memproses transaksi');
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
        <CashierLayout title="Scan QR Customer" showBack>
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

            {/* Mode Toggle */}
            <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => {
                            setInputMode('scan');
                            setManualMemberId('');
                            setScannedCustomer(null);
                            setError('');
                        }}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${inputMode === 'scan'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        <span>QR Scan</span>
                    </button>
                    <button
                        onClick={() => {
                            setInputMode('manual');
                            setScannedCustomer(null);
                            setError('');
                        }}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${inputMode === 'manual'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                        <span>Manual Input</span>
                    </button>
                </div>
            </div>

            {/* Customer Info or Input */}
            <div className="bg-white rounded-xl p-4 shadow-md">
                <h3 className="font-semibold text-gray-800 mb-3">
                    1. {inputMode === 'scan' ? 'Scan QR Customer' : 'Input Member ID'}
                </h3>

                {scannedCustomer ? (
                    <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6 text-center space-y-3">
                        <div className="bg-blue-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-gray-800">{scannedCustomer.name}</p>
                            <p className="text-sm text-gray-600 font-mono">{scannedCustomer.member_id}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">Current Stamps</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {scannedCustomer.current_stamps} 🎫
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setScannedCustomer(null);
                                setManualMemberId('');
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 underline"
                        >
                            Input customer lain
                        </button>
                    </div>
                ) : (
                    <>
                        {inputMode === 'scan' && (
                            <QRScanner
                                onScanSuccess={async (data) => {
                                    setLoading(true);
                                    setError('');
                                    try {
                                        // Parse QR data - could be member_id or JSON
                                        let memberId = data;
                                        try {
                                            const parsed = JSON.parse(data);
                                            memberId = parsed.member_id || parsed.memberId || data;
                                        } catch {
                                            // Not JSON, use as-is
                                        }

                                        // First, try to approve any waiting QR login
                                        try {
                                            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                                            await fetch('/api/qr-login/approve', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'X-CSRF-TOKEN': csrfToken || '',
                                                },
                                                body: JSON.stringify({ member_id: memberId }),
                                            });
                                            // We don't care if this fails - it just means no one was waiting
                                        } catch {
                                            // Ignore - customer might not be in waiting mode
                                        }

                                        // Then do normal customer lookup
                                        const response = await fetch(`/api/customer/lookup?member_id=${memberId}`);
                                        const result = await response.json();

                                        if (response.ok && result.customer) {
                                            setScannedCustomer({
                                                name: result.customer.user.name,
                                                member_id: result.customer.user.member_id,
                                                current_stamps: result.customer.current_stamps,
                                            });
                                            setSuccess('Customer ditemukan! Silakan input jumlah belanja.');
                                        } else {
                                            setError(result.message || 'Customer tidak ditemukan');
                                        }
                                    } catch (err) {
                                        setError('Gagal memproses QR Code');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                onScanError={(err) => setError(err)}
                            />
                        )}

                        {inputMode === 'manual' && (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Member ID
                                    </label>
                                    <input
                                        type="text"
                                        value={manualMemberId}
                                        onChange={(e) => setManualMemberId(formatMemberId(e.target.value))}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg"
                                        placeholder="MXU-HCI-2024-00001"
                                        maxLength={18}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Format: MXU-HCI-YYYY-XXXXX atau MXU-YYYY-XXXXX</p>
                                </div>
                                <button
                                    onClick={handleManualLookup}
                                    disabled={loading || !manualMemberId}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span>{loading ? 'Mencari...' : 'Lookup Customer'}</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Transaction Form */}
            <div className="bg-white rounded-xl p-4 shadow-md">
                <h3 className="font-semibold text-gray-800 mb-3">2. Input Transaksi</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jumlah Belanja
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                                placeholder="15000"
                                min="15000"
                                step="1000"
                                disabled={loading}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Minimal Rp 15.000</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !scannedCustomer || !amount}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span>{loading ? 'Memproses...' : 'Proses Transaksi (+1 Stamp)'}</span>
                    </button>
                </form>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">Catatan:</span> Customer akan mendapat{' '}
                    <span className="font-bold text-blue-600">1 stamp</span> per transaksi,
                    berapapun jumlahnya (min Rp 15.000).
                </p>
            </div>
        </CashierLayout>
    );
}
