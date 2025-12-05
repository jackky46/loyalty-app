import { Head, Link } from '@inertiajs/react';
import { ReactNode, useEffect } from 'react';

interface Props {
    children: ReactNode;
    title: string;
}

export default function AdminLayout({ children, title }: Props) {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }
    }, []);

    return (
        <>
            <Head title={`${title} - Mixue Admin`}>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#059669" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 sticky top-0 z-40 safe-area-pt">
                    <div className="max-w-7xl mx-auto flex items-center space-x-3">
                        <Link href="/admin/dashboard" className="p-1 -ml-1">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-bold">{title}</h1>
                    </div>
                </header>

                {/* Content */}
                <div className="max-w-7xl mx-auto p-4 md:p-6">
                    {children}
                </div>
            </div>
        </>
    );
}
