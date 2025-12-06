import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function QRLogin() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [customerId, setCustomerId] = useState<number | null>(null);

    const handleStartWaiting = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!identifier) {
            setError('Masukkan email atau nomor HP Anda');
            setLoading(false);
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch('/api/qr-login/start-waiting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({ identifier }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Gagal memulai waiting mode');
                setLoading(false);
                return;
            }

            // Start waiting & polling
            setWaiting(true);
            setLoading(false);
            setCustomerId(data.customerId);

        } catch (err) {
            setError('Terjadi kesalahan');
            setLoading(false);
        }
    };

    // Polling effect
    useEffect(() => {
        if (!waiting || !customerId) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/qr-login/check-waiting?customerId=${customerId}`);
                const data = await res.json();

                if (data.loginApproved) {
                    clearInterval(interval);
                    setLoginSuccess(true);

                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = '/customer/dashboard';
                    }, 1000);
                }
            } catch (err) {
                // Retry on next poll
            }
        }, 2000);

        // Stop polling after 5 minutes
        const timeout = setTimeout(() => {
            clearInterval(interval);
            setWaiting(false);
            setError('Timeout. Silakan coba lagi.');
        }, 300000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [waiting, customerId]);

    return (
        <>
            <Head title="Login dengan QR - Mixue Loyalty" />

            <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-600 p-4">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 text-white">
                        <Link href="/" className="flex items-center space-x-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Kembali</span>
                        </Link>
                        <div className="flex items-center space-x-2">
                            <span className="text-xl">📱</span>
                            <span className="font-semibold">QR Login</span>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6">
                        {!waiting && !loginSuccess && (
                            <>
                                {/* Instructions */}
                                <div className="text-center">
                                    <div className="inline-block bg-red-100 p-3 rounded-full mb-3">
                                        <span className="text-4xl">📱</span>
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                        Login dengan QR Member
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        Masukkan email/HP, lalu tunjukkan QR Member Anda ke kasir
                                    </p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600 text-center">{error}</p>
                                    </div>
                                )}

                                {/* Email/Phone Input Form */}
                                <form onSubmit={handleStartWaiting} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email atau Nomor HP
                                        </label>
                                        <input
                                            type="text"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="nama@email.com atau 081234567890"
                                            disabled={loading}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
                                    >
                                        {loading ? 'Memproses...' : 'Mulai Waiting Mode'}
                                    </button>
                                </form>
                            </>
                        )}

                        {waiting && !loginSuccess && (
                            <>
                                {/* Waiting State */}
                                <div className="text-center py-8">
                                    <div className="inline-block bg-blue-100 p-4 rounded-full mb-4">
                                        <svg className="w-16 h-16 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        Menunggu Scan Kasir...
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        Tunjukkan <span className="font-bold">QR Member Anda</span> ke kasir sekarang
                                    </p>

                                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 text-left">
                                        <p className="font-semibold text-gray-800 mb-2">📌 Cara:</p>
                                        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                                            <li>Buka QR Member Anda (screenshot atau di app)</li>
                                            <li>Tunjukkan ke kasir</li>
                                            <li>Tunggu kasir scan</li>
                                            <li>Otomatis login!</li>
                                        </ol>
                                    </div>
                                </div>
                            </>
                        )}

                        {loginSuccess && (
                            <>
                                {/* Success State */}
                                <div className="text-center py-8">
                                    <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
                                        <svg className="w-16 h-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        Login Berhasil! ✅
                                    </h2>
                                    <p className="text-gray-600">
                                        Mengalihkan ke dashboard...
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Alternative Login */}
                        {!waiting && !loginSuccess && (
                            <div className="text-center pt-4 border-t">
                                <Link href="/" className="text-red-600 hover:underline text-sm">
                                    Login dengan Email/Password
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
