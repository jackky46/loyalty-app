import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Register() {
    const [usePhone, setUsePhone] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Daftar" />

            <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-block bg-red-100 p-3 rounded-full mb-3">
                            <span className="text-4xl">🍦</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            Daftar Akun Baru
                        </h1>
                        <p className="text-sm text-gray-600">
                            Bergabung dan mulai kumpulkan stamp!
                        </p>
                    </div>

                    {/* Error Messages */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            {Object.values(errors).map((error, index) => (
                                <p key={index} className="text-sm text-red-600">{error}</p>
                            ))}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Masukkan nama lengkap"
                                disabled={processing}
                                required
                            />
                        </div>

                        {/* Toggle Email/Phone */}
                        <div className="flex items-center space-x-2 text-sm">
                            <button
                                type="button"
                                onClick={() => setUsePhone(!usePhone)}
                                className="text-red-600 hover:underline font-medium"
                            >
                                {usePhone ? 'Gunakan Email' : 'Gunakan Nomor HP'}
                            </button>
                            <span className="text-gray-500">sebagai gantinya</span>
                        </div>

                        {/* Email or Phone */}
                        {!usePhone ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="nama@email.com"
                                    disabled={processing}
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nomor HP <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="081234567890"
                                    disabled={processing}
                                />
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Minimal 6 karakter"
                                disabled={processing}
                                required
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Konfirmasi Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Ulangi password"
                                disabled={processing}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            {processing ? 'Mendaftar...' : 'Daftar Sekarang'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600">Sudah punya akun? </span>
                        <Link href={route('login')} className="text-red-600 hover:underline font-medium">
                            Masuk di sini
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
