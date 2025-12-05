import CustomerLayout from '@/Layouts/CustomerLayout';
import { useState } from 'react';

interface Transaction {
    id: number;
    total_amount: number;
    stamps_earned: number;
    transaction_date: string;
    location?: {
        name: string;
    };
}

interface Redemption {
    id: number;
    redeemed_at: string;
    product?: {
        name: string;
        price: number;
    };
    location?: {
        name: string;
    };
}

interface StampReward {
    id: number;
    stamps_count: number;
    reason: string;
    created_at: string;
}

interface Props {
    transactions: Transaction[];
    redemptions: Redemption[];
    stampRewards: StampReward[];
}

const getRewardLabel = (reason: string) => {
    switch (reason) {
        case 'BIRTHDAY_PROFILE_REWARD':
            return { label: '🎂 Bonus Tanggal Lahir', color: 'bg-orange-100 text-orange-600' };
        case 'BONUS':
            return { label: '🎁 Bonus', color: 'bg-blue-100 text-blue-600' };
        case 'MANUAL_ADJUSTMENT':
            return { label: '✏️ Penyesuaian', color: 'bg-gray-100 text-gray-600' };
        default:
            return { label: '🎫 Reward', color: 'bg-purple-100 text-purple-600' };
    }
};

export default function History({ transactions, redemptions, stampRewards }: Props) {
    const [activeTab, setActiveTab] = useState<'transactions' | 'redemptions' | 'rewards'>('transactions');

    // Combine transactions with stamp rewards for display
    const allTransactions = [
        ...transactions.map(t => ({ ...t, type: 'transaction' as const })),
        ...stampRewards.map(s => ({ ...s, type: 'reward' as const })),
    ].sort((a, b) => {
        const dateA = a.type === 'transaction' ? new Date(a.transaction_date) : new Date(a.created_at);
        const dateB = b.type === 'transaction' ? new Date(b.transaction_date) : new Date(b.created_at);
        return dateB.getTime() - dateA.getTime();
    });

    return (
        <CustomerLayout title="Riwayat" showBack activeNav="history">
            {/* Header */}
            <div className="bg-white rounded-xl p-4 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Riwayat</h2>
                <p className="text-sm text-gray-600">
                    Lihat transaksi dan penukaran voucher kamu
                </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl p-1 shadow-md flex space-x-1">
                <button
                    onClick={() => setActiveTab('transactions')}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${activeTab === 'transactions'
                        ? 'bg-red-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Transaksi
                </button>
                <button
                    onClick={() => setActiveTab('redemptions')}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${activeTab === 'redemptions'
                        ? 'bg-red-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Penukaran
                </button>
            </div>

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
                <div className="space-y-3">
                    {allTransactions.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center shadow-md">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-gray-500">Belum ada transaksi</p>
                        </div>
                    ) : (
                        allTransactions.map((item) => (
                            item.type === 'transaction' ? (
                                <div
                                    key={`trx-${item.id}`}
                                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-green-100 p-2 rounded-lg">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    Rp {item.total_amount?.toLocaleString('id-ID') || 0}
                                                </p>
                                                <p className="text-xs text-gray-500 flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {item.location?.name || 'Mixue'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-green-100 px-3 py-1 rounded-full">
                                            <span className="text-xs font-bold text-green-600">+{item.stamps_earned} 🎫</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-xs text-gray-400">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(item.transaction_date).toLocaleString('id-ID', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}
                                    </div>
                                </div>
                            ) : (
                                // Stamp Reward (Birthday, Bonus, etc)
                                <div
                                    key={`reward-${item.id}`}
                                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all border-l-4 border-orange-400"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg ${getRewardLabel(item.reason).color.split(' ')[0]}`}>
                                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {getRewardLabel(item.reason).label}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Bonus stamp dari sistem
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full ${getRewardLabel(item.reason).color}`}>
                                            <span className="text-xs font-bold">+{item.stamps_count} 🎫</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-xs text-gray-400">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(item.created_at).toLocaleString('id-ID', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}
                                    </div>
                                </div>
                            )
                        ))
                    )}
                </div>
            )}

            {/* Redemptions Tab */}
            {activeTab === 'redemptions' && (
                <div className="space-y-3">
                    {redemptions.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center shadow-md">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                            <p className="text-gray-500">Belum ada penukaran</p>
                        </div>
                    ) : (
                        redemptions.map((red) => (
                            <div
                                key={red.id}
                                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-purple-100 p-2 rounded-lg">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{red.product?.name || 'Free Item'}</p>
                                            <p className="text-xs text-gray-500 flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {red.location?.name || 'Mixue'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Senilai</p>
                                        <p className="font-semibold text-purple-600">
                                            Rp {red.product?.price?.toLocaleString('id-ID') || 0}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center text-xs text-gray-400">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {new Date(red.redeemed_at).toLocaleString('id-ID', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </CustomerLayout>
    );
}
