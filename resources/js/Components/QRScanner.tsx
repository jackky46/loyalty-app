import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
    onScanSuccess: (data: string) => void;
    onScanError?: (error: string) => void;
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [error, setError] = useState('');

    const startScanner = async () => {
        try {
            const scanner = new Html5Qrcode('qr-reader');
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    onScanSuccess(decodedText);
                    stopScanner();
                },
                () => {
                    // Ignore continuous scan errors
                }
            );

            setIsScanning(true);
            setError('');
        } catch (err: any) {
            const errorMsg = 'Tidak bisa mengakses kamera. Pastikan permission diberikan.';
            setError(errorMsg);
            if (onScanError) onScanError(errorMsg);
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                const state = await scannerRef.current.getState();
                if (state === 2 || state === 3) {
                    await scannerRef.current.stop();
                }
                scannerRef.current.clear();
                setIsScanning(false);
            } catch (err) {
                console.log('Scanner stop handled:', err);
                setIsScanning(false);
            }
        }
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                try {
                    scannerRef.current.stop().catch(() => { });
                } catch {
                    // Ignore
                }
            }
        };
    }, []);

    return (
        <div className="space-y-4">
            {/* Scanner Container */}
            <div className="relative">
                <div
                    id="qr-reader"
                    className="rounded-xl overflow-hidden border-2 border-blue-300 bg-gray-900 min-h-[300px]"
                ></div>

                {/* Instructions Overlay */}
                {!isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm rounded-xl">
                        <div className="text-center p-6 space-y-4">
                            <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <div className="text-white space-y-2">
                                <p className="font-bold text-lg">Cara Scan QR Code:</p>
                                <ul className="text-sm space-y-1 text-left max-w-xs mx-auto text-gray-200">
                                    <li>• Tekan tombol "Mulai Scan"</li>
                                    <li>• Arahkan kamera ke QR code</li>
                                    <li>• Pastikan QR code terlihat jelas</li>
                                    <li>• Scanner otomatis mendeteksi</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Scanner Controls */}
            <div className="flex gap-3">
                {!isScanning ? (
                    <button
                        onClick={startScanner}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Mulai Scan</span>
                    </button>
                ) : (
                    <button
                        onClick={stopScanner}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                        </svg>
                        <span>Stop Scan</span>
                    </button>
                )}
            </div>
        </div>
    );
}
