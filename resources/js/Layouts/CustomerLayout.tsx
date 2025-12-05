import { Head, Link, usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';

interface Notification {
    id: number;
    title: string;
    message: string;
    read_at: string | null;
    created_at: string;
}

interface Props {
    children: ReactNode;
    title: string;
    showBack?: boolean;
    backUrl?: string;
    activeNav?: string;
    showNotificationBell?: boolean;
    unreadNotifications?: number;
    recentNotifications?: Notification[];
}

export default function CustomerLayout({
    children,
    title,
    showBack = false,
    backUrl = '/customer/dashboard',
    activeNav = 'home',
    showNotificationBell = true,
    unreadNotifications = 0,
    recentNotifications = [],
}: Props) {
    const [showNotificationPopup, setShowNotificationPopup] = useState(false);

    // Register service worker on mount
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }
    }, []);

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (showNotificationPopup && !(e.target as Element).closest('.notification-popup-container')) {
                setShowNotificationPopup(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showNotificationPopup]);

    const navItems = [
        {
            id: 'home',
            label: 'Home',
            href: '/customer/dashboard',
            icon: (active: boolean) => (
                <svg className={`w-6 h-6 ${active ? 'text-red-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            id: 'vouchers',
            label: 'Voucher',
            href: '/customer/vouchers',
            icon: (active: boolean) => (
                <svg className={`w-6 h-6 ${active ? 'text-red-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
            )
        },
        {
            id: 'history',
            label: 'Riwayat',
            href: '/customer/history',
            icon: (active: boolean) => (
                <svg className={`w-6 h-6 ${active ? 'text-red-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: 'notifications',
            label: 'Notifikasi',
            href: '/customer/notifications',
            icon: (active: boolean) => (
                <svg className={`w-6 h-6 ${active ? 'text-red-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            ),
            badge: unreadNotifications > 0 ? unreadNotifications : undefined
        },
        {
            id: 'locations',
            label: 'Lokasi',
            href: '/customer/locations',
            icon: (active: boolean) => (
                <svg className={`w-6 h-6 ${active ? 'text-red-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
        {
            id: 'profile',
            label: 'Profil',
            href: '/customer/profile',
            icon: (active: boolean) => (
                <svg className={`w-6 h-6 ${active ? 'text-red-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
    ];

    const formatTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        return `${diffDays} hari lalu`;
    };

    return (
        <>
            <Head title={`${title} - Mixue Loyalty`}>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#dc2626" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
                <link rel="apple-touch-icon" href="/icons/icon-192.png" />
            </Head>

            <div className="min-h-screen bg-gray-50 pb-20">
                {/* Header */}
                <header className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 sticky top-0 z-40 safe-area-pt">
                    <div className="max-w-md mx-auto flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            {showBack ? (
                                <Link href={backUrl} className="p-1 -ml-1">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                            ) : (
                                <span className="text-2xl">🍦</span>
                            )}
                            <h1 className="font-bold text-lg">{title}</h1>
                        </div>
                        {showNotificationBell && (
                            <div className="notification-popup-container relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowNotificationPopup(!showNotificationPopup);
                                    }}
                                    className="relative p-2"
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unreadNotifications > 0 && (
                                        <span className="absolute top-0 right-0 bg-white text-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                            {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                        </span>
                                    )}
                                </button>

                                {/* Notification Popup */}
                                {showNotificationPopup && (
                                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                        <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                                            <span className="font-semibold text-gray-800">Notifikasi</span>
                                            {unreadNotifications > 0 && (
                                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                                    {unreadNotifications} baru
                                                </span>
                                            )}
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {recentNotifications.length === 0 ? (
                                                <div className="p-4 text-center text-gray-500 text-sm">
                                                    Belum ada notifikasi
                                                </div>
                                            ) : (
                                                recentNotifications.slice(0, 5).map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        className={`p-3 border-b last:border-b-0 hover:bg-gray-50 ${!notif.read_at ? 'bg-red-50' : ''}`}
                                                    >
                                                        <p className={`text-sm ${!notif.read_at ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
                                                            {notif.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{notif.message}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(notif.created_at)}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <Link
                                            href="/customer/notifications"
                                            className="block p-3 text-center text-red-600 font-medium text-sm hover:bg-gray-50 border-t"
                                            onClick={() => setShowNotificationPopup(false)}
                                        >
                                            Lihat Semua Notifikasi →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </header>

                {/* Content */}
                <div className="max-w-md mx-auto p-4 space-y-4">
                    {children}
                </div>

                {/* Bottom Navigation - 6 items */}
                <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl z-50 safe-area-pb">
                    <div className="max-w-md mx-auto flex justify-around items-center py-1">
                        {navItems.map((item) => {
                            const isActive = activeNav === item.id;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className="flex flex-col items-center py-1 px-2 transition-all duration-200 relative"
                                >
                                    <div className={`p-1 rounded-lg transition-all ${isActive ? 'bg-red-50' : ''}`}>
                                        {item.icon(isActive)}
                                        {item.badge && (
                                            <span className="absolute -top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                                {item.badge > 9 ? '9+' : item.badge}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`text-xs mt-0.5 font-medium ${isActive ? 'text-red-600' : 'text-gray-400'}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </>
    );
}
