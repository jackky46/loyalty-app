import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

interface Props {
    canLogin: boolean;
    canRegister: boolean;
    auth?: {
        user?: {
            id: number;
            name: string;
            role: string;
        };
    };
}

export default function Welcome({ canLogin, canRegister, auth }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    // If already logged in, this page won't be shown (handled by route)

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('login'), {
            onFinish: () => {
                reset('password');
                setIsLoading(false);
            },
        });
    };

    // Register service worker
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered:', registration.scope);
                })
                .catch((error) => {
                    console.log('SW registration failed:', error);
                });
        }
    }, []);

    return (
        <>
            <Head title="Masuk - Mixue Loyalty">
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#dc2626" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <link rel="apple-touch-icon" href="/icons/icon-192.png" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-block bg-red-100 p-3 rounded-full mb-3">
                            <span className="text-4xl">🍦</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            Mixue Loyalty
                        </h1>
                        <p className="text-sm text-gray-600">
                            Masuk untuk cek stamp & reward kamu
                        </p>
                    </div>

                    {/* Error Message */}
                    {errors.login && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{errors.login}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-4">
                        {/* Email or Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email atau Nomor HP
                            </label>
                            <input
                                type="text"
                                value={data.login}
                                onChange={(e) => setData('login', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="nama@email.com atau 081234567890"
                                disabled={processing || isLoading}
                                autoFocus
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="Masukkan password"
                                disabled={processing || isLoading}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                Ingat saya
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing || isLoading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
                        >
                            {(processing || isLoading) ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Masuk...
                                </>
                            ) : 'Masuk'}
                        </button>
                    </form>

                    {/* QR Login Option */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Atau</span>
                            </div>
                        </div>

                        <Link
                            href="/qr-login"
                            className="mt-4 w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg border-2 border-gray-300 transition-colors flex items-center justify-center space-x-2"
                        >
                            <span className="text-xl">📱</span>
                            <span>Login dengan QR Code</span>
                        </Link>
                    </div>

                    {/* Register Link */}
                    {canRegister && (
                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-600">Belum punya akun? </span>
                            <Link href={route('register')} className="text-red-600 hover:underline font-medium">
                                Daftar sekarang
                            </Link>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400">
                            © 2024 Mixue Loyalty App
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
