import { Head, Link } from '@inertiajs/react';
import { ReactNode, useEffect } from 'react';

interface Props {
    children: ReactNode;
    title: string;
    showBack?: boolean;
    backUrl?: string;
}

export default function CashierLayout({
    children,
    title,
    showBack = false,
    backUrl = '/cashier/dashboard',
}: Props) {
    // Register service worker on mount
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }
    }, []);

    return (
        <>
            <Head title={`${title} - Mixue Cashier`}>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#2563eb" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
                <link rel="apple-touch-icon" href="/icons/icon-192.png" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-blue-600 text-white p-4 sticky top-0 z-40 safe-area-pt">
                    <div className="max-w-md mx-auto flex items-center space-x-3">
                        {showBack && (
                            <Link href={backUrl} className="p-1 -ml-1">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                        )}
                        <h1 className="text-xl font-bold">{title}</h1>
                    </div>
                </header>

                {/* Content */}
                <div className="max-w-md mx-auto p-4 space-y-4">
                    {children}
                </div>
            </div>
        </>
    );
}
