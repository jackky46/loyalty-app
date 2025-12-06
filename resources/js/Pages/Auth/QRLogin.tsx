import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { QRScanner } from '@/Components/QRScanner';

export default function QRLogin() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleScan = async (data: string) => {
        setError('');
        setLoading(true);

        try {
            // Parse QR data - could be member_id or JSON
            let memberId = data;
            try {
                const parsed = JSON.parse(data);
                memberId = parsed.member_id || parsed.memberId || data;
            } catch {
                // Not JSON, use as-is
            }

            // Call QR login API
            router.post('/qr-login', { member_id: memberId }, {
                onSuccess: () => {
                    setSuccess('Login berhasil! Mengalihkan...');
                },
                onError: (errors: any) => {
                    setError(errors.member_id || 'QR Code tidak valid atau user tidak ditemukan');
                    setLoading(false);
                },
            });
        } catch (err) {
            setError('Gagal memproses QR Code');
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Login dengan QR - Mixue Loyalty" />

            <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <Link href="/" className="text-red-600 hover:text-red-700 inline-flex items-center mb-3">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali
                        </Link>
                        <div className="inline-block bg-red-100 p-3 rounded-full mb-3">
                            <span className="text-4xl">📱</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 mb-1">
                            Login dengan QR Code
                        </h1>
                        <p className="text-sm text-gray-600">
                            Scan QR Code member card kamu
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-600">{success}</p>
                        </div>
                    )}

                    {/* QR Scanner */}
                    {!success && (
                        <QRScanner
                            onScanSuccess={handleScan}
                            onScanError={(err) => setError(err)}
                        />
                    )}

                    {loading && (
                        <div className="text-center mt-4">
                            <svg className="animate-spin h-8 w-8 text-red-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-gray-600 mt-2">Memproses...</p>
                        </div>
                    )}

                    {/* Manual Login Link */}
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-red-600 hover:underline text-sm font-medium">
                            Login dengan Email/Password
                        </Link>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            © 2024 Mixue Loyalty App
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
