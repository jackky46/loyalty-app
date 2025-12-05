import CashierLayout from '@/Layouts/CashierLayout';
import { Link } from '@inertiajs/react';

interface Transaction {
    id: number;
    customer: {
        user: {
            name: string;
            member_id: string;
        };
        current_stamps: number;
    };
    location: {
        name: string;
    };
    total_amount: number;
    stamps_earned: number;
    transaction_date: string;
}

interface Props {
    transactions: {
        data: Transaction[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function History({ transactions }: Props) {
    return (
        <CashierLayout title="Riwayat Transaksi" showBack>
            {/* Stats Summary */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm opacity-90">Total Transaksi</p>
                        <p className="text-2xl font-bold">{transactions.data.length}</p>
                    </div>
                    <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-800">Semua Transaksi</h3>
                </div>

                {transactions.data.length === 0 ? (
                    <div className="p-8 text-center">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-gray-500">Belum ada transaksi</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {transactions.data.map((trx) => (
                            <div key={trx.id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{trx.customer?.user?.name || 'Customer'}</p>
                                            <p className="text-xs text-gray-500 font-mono">{trx.customer?.user?.member_id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600">
                                            Rp {trx.total_amount?.toLocaleString('id-ID')}
                                        </p>
                                        <p className="text-xs text-blue-600">+{trx.stamps_earned} stamp</p>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                                    <span>{trx.location?.name}</span>
                                    <span>{new Date(trx.transaction_date).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {transactions.last_page > 1 && (
                    <div className="p-4 border-t flex justify-center space-x-2">
                        {transactions.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-3 py-1 rounded ${link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </CashierLayout>
    );
}
