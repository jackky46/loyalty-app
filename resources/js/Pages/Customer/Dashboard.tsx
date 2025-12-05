import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

interface Props {
    user: {
        id: number;
        name: string;
        member_id: string;
    };
    customer: {
        current_stamps: number;
        total_stamps_earned: number;
        total_stamps_used: number;
    } | null;
    currentStamps: number;
    totalStampsEarned: number;
    recentTransactions: any[];
    activeVouchers: any[];
    unreadNotifications: number;
    recentNotifications: any[];
    content: Record<string, string>;
}

// Stamp Card Component
function StampCard({ currentStamps, content }: { currentStamps: number; content: Record<string, string> }) {
    const totalSlots = 10;

    return (
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 shadow-xl">
            {/* Header Card */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div className="bg-white rounded-full p-2">
                        <span className="text-2xl">🍦</span>
                    </div>
                    <div className="text-white">
                        <p className="text-xs opacity-90">MIXUE</p>
                        <p className="font-bold text-sm">MEMBER CARD</p>
                    </div>
                </div>
                <div className="text-white text-right">
                    <p className="text-xs opacity-90">Stamp</p>
                    <p className="text-xl font-bold">{currentStamps}/{totalSlots}</p>
                </div>
            </div>

            {/* Rewards Info - At top like screenshot */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-white">
                    <p className="text-xs opacity-90 mb-0.5">5 Stamps</p>
                    <p className="font-bold text-sm">{content.home_5_stamps_reward?.split(' max')[0] || 'FREE DRINK'}</p>
                    <p className="text-xs opacity-75">{content.home_5_stamps_reward?.includes('max') ? 'max ' + content.home_5_stamps_reward.split('max ')[1] : 'max Rp 22k'}</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-white">
                    <p className="text-xs opacity-90 mb-0.5">10 Stamps</p>
                    <p className="font-bold text-sm">{content.home_10_stamps_reward?.split(' max')[0] || 'FREE ITEM'}</p>
                    <p className="text-xs opacity-75">{content.home_10_stamps_reward?.includes('max') ? 'max ' + content.home_10_stamps_reward.split('max ')[1] : 'max Rp 22k'}</p>
                </div>
            </div>

            {/* Stamp Grid */}
            <div className="bg-white rounded-xl p-4">
                {/* Row 1 */}
                <div className="grid grid-cols-5 gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="relative">
                            <div
                                className={`aspect-square rounded-full flex items-center justify-center transition-all ${currentStamps >= num
                                    ? 'bg-red-500 border-red-600 shadow-lg scale-105'
                                    : 'bg-gray-100 border-gray-300 border-dashed border-2'
                                    }`}
                            >
                                {currentStamps >= num ? (
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ) : (
                                    <span className="text-gray-400 font-bold text-sm">{num}</span>
                                )}
                            </div>
                            {num === 5 && currentStamps >= 5 && (
                                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full px-1.5 py-0.5 text-xs font-bold text-red-600 shadow-md animate-pulse">
                                    FREE
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-5 gap-2">
                    {[6, 7, 8, 9, 10].map((num) => (
                        <div key={num} className="relative">
                            <div
                                className={`aspect-square rounded-full flex items-center justify-center transition-all ${currentStamps >= num
                                    ? 'bg-red-500 border-red-600 shadow-lg scale-105'
                                    : 'bg-gray-100 border-gray-300 border-dashed border-2'
                                    }`}
                            >
                                {currentStamps >= num ? (
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ) : (
                                    <span className="text-gray-400 font-bold text-sm">{num}</span>
                                )}
                            </div>
                            {num === 10 && currentStamps >= 10 && (
                                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full px-1.5 py-0.5 text-xs font-bold text-red-600 shadow-md animate-pulse">
                                    FREE
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 text-center">
                        {content.home_stamp_info || 'Dapatkan 1 stempel setiap pembelian min. Rp 15.000'}
                    </p>
                </div>
            </div>

            {/* Ready to redeem indicator */}
            {currentStamps >= 5 && (
                <Link
                    href="/customer/vouchers"
                    className="mt-3 bg-yellow-400 rounded-lg p-3 flex items-center justify-between animate-pulse"
                >
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">🎁</span>
                        <span className="font-bold text-red-600 text-sm">
                            {Math.floor(currentStamps / 5)} Reward Siap Ditukar!
                        </span>
                    </div>
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            )}
        </div>
    );
}

export default function Dashboard({
    currentStamps: initialStamps,
    totalStampsEarned,
    recentTransactions,
    activeVouchers,
    unreadNotifications,
    recentNotifications,
    content = {},
}: Props) {
    // State for real-time stamp updates
    const [stamps, setStamps] = useState(initialStamps);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Polling for real-time stamp updates
    useEffect(() => {
        const fetchStamps = async () => {
            try {
                const res = await fetch('/customer/api/stamps');
                if (res.ok) {
                    const data = await res.json();
                    setStamps(data.current_stamps);
                }
            } catch (err) {
                // Silent fail - will retry next interval
            }
        };

        // Start polling
        const startPolling = () => {
            if (!intervalRef.current) {
                intervalRef.current = setInterval(fetchStamps, 5000); // 5 seconds
            }
        };

        // Stop polling
        const stopPolling = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        // Handle visibility change
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopPolling();
            } else {
                fetchStamps(); // Fetch immediately when visible
                startPolling();
            }
        };

        // Start polling on mount
        startPolling();
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup
        return () => {
            stopPolling();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <CustomerLayout
            title="Mixue Loyalty"
            activeNav="home"
            unreadNotifications={unreadNotifications}
            recentNotifications={recentNotifications}
        >
            {/* Promo Banner from CMS */}
            {content.promo_banner_text && (
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-4 text-white shadow-lg animate-pulse">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">🎉</span>
                        <div
                            className="flex-1 text-sm font-medium"
                            dangerouslySetInnerHTML={{ __html: content.promo_banner_text }}
                        />
                    </div>
                </div>
            )}

            {/* Virtual Stamp Card - Primary focus with real-time updates */}
            <StampCard currentStamps={stamps} content={content} />

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
                <Link
                    href="/customer/qrcode"
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all flex flex-col items-center space-y-2 border-2 border-transparent hover:border-red-500"
                >
                    <div className="bg-purple-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">QR Code</span>
                </Link>

                <Link
                    href="/customer/vouchers"
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all flex flex-col items-center space-y-2 border-2 border-transparent hover:border-red-500 relative"
                >
                    <div className="bg-red-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">Voucher</span>
                    {activeVouchers.length > 0 && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                            {activeVouchers.length}
                        </span>
                    )}
                </Link>

                <Link
                    href="/customer/history"
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all flex flex-col items-center space-y-2 border-2 border-transparent hover:border-red-500"
                >
                    <div className="bg-blue-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">Riwayat</span>
                </Link>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-gray-800 mb-1">{content.home_tips_title || 'Cara Dapat Stamp'}</p>
                        <p className="text-sm text-gray-600">
                            {content.home_tips_content || 'Setiap 1x pembelian minimal Rp 15.000 = 1 stamp. Kumpulkan 5 atau 10 stamp untuk FREE product!'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistik Kamu */}
            <div className="bg-white rounded-xl p-4 shadow-md">
                <h3 className="font-semibold text-gray-800 mb-3">Statistik Kamu</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-red-600">{totalStampsEarned}</p>
                        <p className="text-xs text-gray-500">Total Stamps</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-green-600">{activeVouchers.length}</p>
                        <p className="text-xs text-gray-500">Voucher Aktif</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-blue-600">{recentTransactions.length}</p>
                        <p className="text-xs text-gray-500">Transaksi</p>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
