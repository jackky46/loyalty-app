import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';

interface Props {
    settings: {
        min_transaction_amount: string;
        stamps_for_small_voucher: string;
        stamps_for_large_voucher: string;
        voucher_expiry_days: string;
        max_voucher_price: string;
        birthday_reward_stamps: string;
    };
    logoUrl?: string | null;
}

export default function Settings({ settings: initialSettings, logoUrl }: Props) {
    const [settings, setSettings] = useState({
        min_transaction_amount: initialSettings?.min_transaction_amount || '15000',
        stamps_for_small_voucher: initialSettings?.stamps_for_small_voucher || '5',
        stamps_for_large_voucher: initialSettings?.stamps_for_large_voucher || '10',
        voucher_expiry_days: initialSettings?.voucher_expiry_days || '30',
        max_voucher_price: initialSettings?.max_voucher_price || '22000',
        birthday_reward_stamps: initialSettings?.birthday_reward_stamps || '2',
    });
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [currentLogo, setCurrentLogo] = useState<string | null>(logoUrl || null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        setSaving(true);
        router.put('/admin/settings', settings, {
            onFinish: () => setSaving(false),
        });
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('logo', file);

        setUploadingLogo(true);
        try {
            const response = await fetch('/admin/settings/logo', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();
            if (data.success) {
                setCurrentLogo(data.logoUrl);
            }
        } catch (err) {
            console.error('Logo upload failed:', err);
        } finally {
            setUploadingLogo(false);
        }
    };

    const formatRupiah = (value: string) => {
        const num = parseInt(value || '0');
        return new Intl.NumberFormat('id-ID').format(num);
    };

    return (
        <AdminLayout title="System Settings">
            {/* Save Button (Mobile) */}
            <div className="mb-4 md:hidden">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{saving ? 'Menyimpan...' : 'Simpan Settings'}</span>
                </button>
            </div>

            <div className="space-y-4">
                {/* Branding / Logo */}
                <div className="bg-white rounded-xl shadow-md">
                    <div className="p-4 border-b">
                        <h3 className="font-semibold text-gray-800 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Branding / Logo
                        </h3>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                                {currentLogo ? (
                                    <img src={currentLogo} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => logoInputRef.current?.click()}
                                    disabled={uploadingLogo}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium text-sm"
                                >
                                    {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                                </button>
                                <p className="text-xs text-gray-500 mt-2">PNG atau JPG, max 2MB</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stamp Rules */}
                <div className="bg-white rounded-xl shadow-md">
                    <div className="p-4 border-b">
                        <h3 className="font-semibold text-gray-800 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Aturan Stamp
                        </h3>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Minimal Transaksi (Rp)
                            </label>
                            <input
                                type="number"
                                value={settings.min_transaction_amount}
                                onChange={(e) => setSettings({ ...settings, min_transaction_amount: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                min="0"
                                step="1000"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Preview: Rp {formatRupiah(settings.min_transaction_amount)}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stamps untuk Voucher Kecil
                                </label>
                                <input
                                    type="number"
                                    value={settings.stamps_for_small_voucher}
                                    onChange={(e) => setSettings({ ...settings, stamps_for_small_voucher: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stamps untuk Voucher Besar
                                </label>
                                <input
                                    type="number"
                                    value={settings.stamps_for_large_voucher}
                                    onChange={(e) => setSettings({ ...settings, stamps_for_large_voucher: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Voucher Settings */}
                <div className="bg-white rounded-xl shadow-md">
                    <div className="p-4 border-b">
                        <h3 className="font-semibold text-gray-800">Pengaturan Voucher</h3>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maksimal Harga Produk Voucher (Rp)
                            </label>
                            <input
                                type="number"
                                value={settings.max_voucher_price}
                                onChange={(e) => setSettings({ ...settings, max_voucher_price: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                min="0"
                                step="1000"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Preview: Rp {formatRupiah(settings.max_voucher_price)}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Masa Berlaku Voucher (hari)
                            </label>
                            <input
                                type="number"
                                value={settings.voucher_expiry_days}
                                onChange={(e) => setSettings({ ...settings, voucher_expiry_days: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                min="1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Voucher akan kadaluarsa {settings.voucher_expiry_days} hari setelah dibuat
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reward Settings */}
                <div className="bg-white rounded-xl shadow-md">
                    <div className="p-4 border-b">
                        <h3 className="font-semibold text-gray-800 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                            Pengaturan Reward
                        </h3>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Birthday Profile Reward (stamps)
                            </label>
                            <input
                                type="number"
                                value={settings.birthday_reward_stamps}
                                onChange={(e) => setSettings({ ...settings, birthday_reward_stamps: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                min="0"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Jumlah stamp yang diberikan saat customer pertama kali mengisi tanggal lahir
                            </p>
                        </div>
                    </div>
                </div>
                {/* Desktop Save Button */}
                <div className="hidden md:block">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{saving ? 'Menyimpan...' : 'Simpan Settings'}</span>
                    </button>
                </div>

                {/* Info */}
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">⚠️ Penting</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Perubahan settings akan langsung berlaku untuk semua transaksi baru</li>
                        <li>• Settings disimpan di database dan akan persist setelah restart</li>
                        <li>• Voucher dan transactions yang sudah ada tidak terpengaruh</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}
