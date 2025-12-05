import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';

interface Props {
    user: {
        id: number;
        name: string;
        role: string;
    };
    employee: {
        id: number;
        location?: {
            name: string;
        };
    } | null;
    todayStats: {
        transactions: number;
        stamps: number;
        redemptions: number;
    };
    recentTransactions: any[];
    announcement: string | null;
}

export default function Dashboard({ user, employee, todayStats, recentTransactions, announcement }: Props) {
    // Register service worker on mount
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }
    }, []);

    return (
        <>
            <Head title="Cashier Dashboard - Mixue">
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#2563eb" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 safe-area-pt">
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                {/* Outline User Icon */}
                                <div className="bg-white/20 p-2 rounded-full">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="font-bold text-lg">Halo, {user.name}!</h1>
                                    <p className="text-xs opacity-90">{employee?.location?.name || 'Mixue'}</p>
                                </div>
                            </div>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="text-sm bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Logout</span>
                            </Link>
                        </div>

                        {/* Today Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold">{todayStats.transactions}</p>
                                <p className="text-xs opacity-90">Transaksi</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold">{todayStats.stamps}</p>
                                <p className="text-xs opacity-90">Stamps</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold">{todayStats.redemptions}</p>
                                <p className="text-xs opacity-90">Redeem</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-md mx-auto p-4 space-y-4">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href="/cashier/scan"
                            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col items-center space-y-3 border-2 border-transparent hover:border-blue-500"
                        >
                            <div className="bg-blue-100 p-4 rounded-full">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <span className="font-semibold text-gray-800">Scan QR</span>
                            <span className="text-xs text-gray-500">Input Transaksi</span>
                        </Link>

                        <Link
                            href="/cashier/redeem"
                            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col items-center space-y-3 border-2 border-transparent hover:border-purple-500"
                        >
                            <div className="bg-purple-100 p-4 rounded-full">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                            </div>
                            <span className="font-semibold text-gray-800">Redeem Voucher</span>
                            <span className="text-xs text-gray-500">Tukar Voucher</span>
                        </Link>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-xl p-4 shadow-md">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Transaksi Terakhir
                        </h3>

                        {recentTransactions.length === 0 ? (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="text-gray-500">Belum ada transaksi hari ini</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentTransactions.slice(0, 5).map((trx: any) => (
                                    <div key={trx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{trx.customer?.user?.name || 'Customer'}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(trx.transaction_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-green-600">Rp {trx.total_amount?.toLocaleString('id-ID') || 0}</p>
                                            <p className="text-xs text-blue-600">+{trx.stamps_earned} stamp</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Announcement from CMS */}
                    {announcement && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                            <div className="flex items-start space-x-2">
                                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                                <div>
                                    <p className="font-semibold text-yellow-800 text-sm mb-1">Pengumuman</p>
                                    <div
                                        className="text-sm text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: announcement }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Info */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">Info:</span> Scan QR customer untuk memberikan stamp.
                                Minimal transaksi <span className="font-bold text-blue-600">Rp 15.000</span> untuk mendapat 1 stamp.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
