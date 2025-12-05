import CustomerLayout from '@/Layouts/CustomerLayout';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    action_url?: string;
    is_read: boolean;
    created_at: string;
}

interface Props {
    notifications: Notification[];
    unreadCount: number;
}

export default function Notifications({ notifications, unreadCount }: Props) {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [notificationList, setNotificationList] = useState(notifications);

    const filteredNotifications = filter === 'unread'
        ? notificationList.filter(n => !n.is_read)
        : notificationList;

    const markAsRead = async (id: number) => {
        router.post(`/customer/notifications/${id}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setNotificationList(notificationList.map(n =>
                    n.id === id ? { ...n, is_read: true } : n
                ));
            },
        });
    };

    const markAllAsRead = async () => {
        router.post('/customer/notifications/mark-all-read', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setNotificationList(notificationList.map(n => ({ ...n, is_read: true })));
            },
        });
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        if (notification.action_url) {
            router.visit(notification.action_url);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'success': return 'text-green-600 bg-green-50';
            case 'warning': return 'text-yellow-600 bg-yellow-50';
            case 'promo': return 'text-purple-600 bg-purple-50';
            case 'birthday': return 'text-pink-600 bg-pink-50';
            default: return 'text-blue-600 bg-blue-50';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return '✓';
            case 'warning': return '⚠';
            case 'promo': return '🎉';
            case 'birthday': return '🎂';
            default: return 'ℹ';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Baru saja';
        if (minutes < 60) return `${minutes} menit lalu`;
        if (hours < 24) return `${hours} jam lalu`;
        if (days < 7) return `${days} hari lalu`;
        return date.toLocaleDateString('id-ID');
    };

    const currentUnreadCount = notificationList.filter(n => !n.is_read).length;

    return (
        <CustomerLayout title="Notifikasi" showBack showNotificationBell={false} activeNav="notifications">
            {/* Filter */}
            <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-800">
                        {filter === 'all' ? 'Semua' : 'Belum Dibaca'} ({filteredNotifications.length})
                    </h2>
                    {currentUnreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Tandai semua terbaca
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`py-2 px-4 rounded-lg font-medium transition-all ${filter === 'all'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Semua
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`py-2 px-4 rounded-lg font-medium transition-all ${filter === 'unread'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Belum Dibaca {currentUnreadCount > 0 && `(${currentUnreadCount})`}
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
                <div className="bg-white rounded-xl p-12 shadow-md text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p className="text-gray-500">
                        {filter === 'unread' ? 'Tidak ada notifikasi belum dibaca' : 'Belum ada notifikasi'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`bg-white rounded-xl p-4 shadow-md transition-all cursor-pointer ${notification.is_read
                                ? 'hover:shadow-lg'
                                : 'ring-2 ring-blue-500 hover:ring-blue-600'
                                }`}
                        >
                            <div className="flex items-start space-x-3">
                                {/* Icon */}
                                <div className={`text-2xl p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                                    {getTypeIcon(notification.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <h3 className={`font-semibold text-gray-900 ${!notification.is_read && 'font-bold'}`}>
                                            {notification.title}
                                        </h3>
                                        {!notification.is_read && (
                                            <span className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1"></span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {notification.message}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-xs text-gray-400">
                                            {formatDate(notification.created_at)}
                                        </p>
                                        {notification.action_url && (
                                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </CustomerLayout>
    );
}
