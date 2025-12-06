import CustomerLayout from '@/Layouts/CustomerLayout';
import { usePage } from '@inertiajs/react';

interface Props {
    user: {
        id: number;
        name: string;
        member_id: string;
        phone?: string;
        email?: string;
        qr_code_data: string;
    };
    currentStamps: number;
    content: Record<string, string>;
}

export default function QRCode({ user, currentStamps, content = {} }: Props) {
    const stampsToNextReward = 5 - (currentStamps % 5);

    return (
        <CustomerLayout title="QR Code Saya" showBack activeNav="home">
            {/* Header Info */}
            <div className="bg-white rounded-xl p-4 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-2">QR Code Saya</h2>
                <p className="text-sm text-gray-600">
                    Tunjukkan QR ini ke kasir saat pembelian untuk mendapatkan stamp
                </p>
            </div>

            {/* QR Code Card */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 shadow-xl">
                <div className="bg-white rounded-2xl p-8">
                    {/* User Info */}
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {user.name}
                        </h3>
                        <p className="text-sm text-gray-600">{user.phone || user.email}</p>
                        <div className="mt-2 inline-block bg-red-100 px-4 py-1 rounded-full">
                            <p className="text-xs font-mono font-bold text-red-600">
                                {user.member_id}
                            </p>
                        </div>
                    </div>

                    {/* QR Code - using img with QR code API */}
                    <div className="bg-white p-4 rounded-2xl mx-auto w-fit mb-4 border-4 border-gray-100">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(user.qr_code_data)}`}
                            alt="QR Code"
                            className="w-48 h-48"
                        />
                    </div>

                    {/* Instructions */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600 font-medium">
                            Scan untuk Dapat Stamp
                        </p>
                    </div>
                </div>

                {/* Current Stamps Info */}
                <div className="mt-4 bg-white/10 backdrop-blur rounded-xl p-4 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs opacity-90">Stamp Kamu Saat Ini</p>
                            <p className="text-2xl font-bold">{currentStamps}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs opacity-90">Tinggal</p>
                            <p className="text-2xl font-bold">{stampsToNextReward}</p>
                            <p className="text-xs">stamp lagi</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-gray-800 mb-1">Tips!</p>
                        {content.qr_tips ? (
                            <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: content.qr_tips }} />
                        ) : (
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Pastikan kasir scan QR dengan benar</li>
                                <li>• Setiap pembelian min. Rp 15.000 = 1 stamp</li>
                                <li>• Cek stamp langsung setelah transaksi</li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => {
                        // Save QR functionality
                        window.open(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(user.qr_code_data)}`, '_blank');
                    }}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all flex flex-col items-center space-y-2"
                >
                    <div className="bg-gray-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">Save QR</span>
                </button>

                <button
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'Mixue Loyalty QR',
                                text: `QR Code ${user.name} - ${user.member_id}`,
                                url: window.location.href,
                            });
                        }
                    }}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all flex flex-col items-center space-y-2"
                >
                    <div className="bg-gray-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">Share</span>
                </button>
            </div>
        </CustomerLayout>
    );
}
