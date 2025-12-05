import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ChartData {
    date: string;
    fullDate: string;
    transactions: number;
    stamps: number;
    revenue: number;
    redemptions: number;
    newCustomers: number;
}

interface TopLocation {
    name: string;
    transactions: number;
    revenue: number;
}

interface RecentTransaction {
    id: number;
    customer: string;
    location: string;
    amount: number;
    stamps: number;
    date: string;
}

interface Props {
    user: {
        id: number;
        name: string;
        role: string;
    };
    stats: {
        totalCustomers: number;
        totalTransactions: number;
        totalStamps: number;
        activeVouchers: number;
        totalRevenue: number;
        totalRedemptions: number;
    };
    todayStats: {
        transactions: number;
        stamps: number;
        redemptions: number;
        newCustomers: number;
        revenue: number;
    };
    chartData: ChartData[];
    topLocations: TopLocation[];
    recentTransactions: RecentTransaction[];
}

export default function Dashboard({ user, stats, todayStats, chartData, topLocations, recentTransactions }: Props) {
    // Register service worker on mount
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    const formatCompact = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
        return value.toString();
    };

    return (
        <>
            <Head title="Admin Dashboard - Mixue">
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#059669" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                {/* Modern Header */}
                <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 safe-area-pt shadow-2xl">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white/20 backdrop-blur p-2 rounded-xl">
                                    <span className="text-2xl">🍦</span>
                                </div>
                                <div>
                                    <h1 className="font-bold text-xl">Mixue Admin</h1>
                                    <p className="text-sm text-emerald-100">{user.name} • {user.role}</p>
                                </div>
                            </div>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all hover:scale-105"
                            >
                                Logout
                            </Link>
                        </div>

                        {/* Today Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                                <p className="text-3xl font-bold">{todayStats.transactions}</p>
                                <p className="text-sm text-emerald-100">Transaksi Hari Ini</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                                <p className="text-3xl font-bold">{todayStats.stamps}</p>
                                <p className="text-sm text-emerald-100">Stamps Hari Ini</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                                <p className="text-3xl font-bold">{todayStats.redemptions}</p>
                                <p className="text-sm text-emerald-100">Redeem Hari Ini</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                                <p className="text-3xl font-bold">{todayStats.newCustomers}</p>
                                <p className="text-sm text-emerald-100">Customer Baru</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 col-span-2 md:col-span-1">
                                <p className="text-2xl font-bold">{formatCompact(todayStats.revenue)}</p>
                                <p className="text-sm text-emerald-100">Revenue Hari Ini</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-6xl mx-auto p-4 space-y-6">
                    {/* Overall Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { label: 'Total Customer', value: stats.totalCustomers, icon: '👥', color: 'from-blue-500 to-blue-600' },
                            { label: 'Total Transaksi', value: stats.totalTransactions, icon: '📦', color: 'from-green-500 to-green-600' },
                            { label: 'Total Stamps', value: stats.totalStamps, icon: '🎫', color: 'from-purple-500 to-purple-600' },
                            { label: 'Voucher Aktif', value: stats.activeVouchers, icon: '🎟️', color: 'from-orange-500 to-orange-600' },
                            { label: 'Total Redemption', value: stats.totalRedemptions, icon: '🎁', color: 'from-pink-500 to-pink-600' },
                            { label: 'Total Revenue', value: formatCompact(stats.totalRevenue), icon: '💰', color: 'from-yellow-500 to-yellow-600' },
                        ].map((stat, idx) => (
                            <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-lg`}>
                                <div className="text-2xl mb-2">{stat.icon}</div>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-sm opacity-90">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Transactions & Stamps Trend */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-4">📈 Tren Transaksi & Stamps</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorStamps" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                                    <YAxis stroke="#9ca3af" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                        labelStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="transactions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTransactions)" name="Transaksi" />
                                    <Area type="monotone" dataKey="stamps" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorStamps)" name="Stamps" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Revenue & Redemptions */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-4">💰 Revenue & Redemptions</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                                    <YAxis stroke="#9ca3af" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                        labelStyle={{ color: '#fff' }}
                                        formatter={(value: number, name: string) => [
                                            name === 'Revenue' ? formatCurrency(value) : value,
                                            name
                                        ]}
                                    />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="redemptions" fill="#f59e0b" name="Redemptions" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Customer Growth */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">👥 Pertumbuhan Customer</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                                <YAxis stroke="#9ca3af" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="newCustomers" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899' }} name="Customer Baru" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Top Locations */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-4">🏆 Top Lokasi</h3>
                            <div className="space-y-3">
                                {topLocations.length === 0 ? (
                                    <p className="text-gray-400 text-center py-4">Belum ada data</p>
                                ) : (
                                    topLocations.map((loc, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                            <div className="flex items-center space-x-3">
                                                <span className={`text-2xl ${idx === 0 ? '' : idx === 1 ? '' : ''}`}>
                                                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '📍'}
                                                </span>
                                                <div>
                                                    <p className="font-medium text-white">{loc.name}</p>
                                                    <p className="text-sm text-gray-400">{loc.transactions} transaksi</p>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-emerald-400">{formatCurrency(loc.revenue)}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-4">⚡ Transaksi Terbaru</h3>
                            <div className="space-y-3">
                                {recentTransactions.length === 0 ? (
                                    <p className="text-gray-400 text-center py-4">Belum ada transaksi</p>
                                ) : (
                                    recentTransactions.map((t) => (
                                        <div key={t.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                            <div>
                                                <p className="font-medium text-white">{t.customer}</p>
                                                <p className="text-xs text-gray-400">{t.location}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-emerald-400">{formatCurrency(t.amount)}</p>
                                                <p className="text-xs text-purple-400">+{t.stamps} stamps</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Menu */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">🚀 Menu Admin</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { href: '/admin/customers', icon: '👥', label: 'Customers', color: 'hover:bg-blue-500/20' },
                                { href: '/admin/employees', icon: '👔', label: 'Employees', color: 'hover:bg-green-500/20' },
                                { href: '/admin/locations', icon: '📍', label: 'Locations', color: 'hover:bg-purple-500/20' },
                                { href: '/admin/products', icon: '🍦', label: 'Products', color: 'hover:bg-orange-500/20' },
                                { href: '/admin/notifications', icon: '🔔', label: 'Notifications', color: 'hover:bg-yellow-500/20' },
                                { href: '/admin/popups', icon: '📣', label: 'Popups', color: 'hover:bg-pink-500/20' },
                                { href: '/admin/content', icon: '📝', label: 'Content', color: 'hover:bg-indigo-500/20' },
                                { href: '/admin/reports', icon: '📊', label: 'Reports', color: 'hover:bg-cyan-500/20' },
                                { href: '/admin/email-templates', icon: '📧', label: 'Email Templates', color: 'hover:bg-teal-500/20' },
                                { href: '/admin/settings', icon: '⚙️', label: 'Settings', color: 'hover:bg-gray-500/20' },
                            ].map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    className={`flex flex-col items-center p-4 bg-white/5 rounded-xl transition-all hover:scale-105 ${item.color} border border-white/10`}
                                >
                                    <span className="text-3xl mb-2">{item.icon}</span>
                                    <span className="text-sm font-medium text-white">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
