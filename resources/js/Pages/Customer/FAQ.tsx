import CustomerLayout from '@/Layouts/CustomerLayout';
import { useState } from 'react';

interface FAQ {
    question: string;
    answer: string;
}

interface Props {
    faqs: FAQ[];
}

export default function FAQ({ faqs }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <CustomerLayout title="Bantuan & FAQ" showBack activeNav="profile">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white text-center">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-bold">Pusat Bantuan</h2>
                <p className="text-sm opacity-90">Temukan jawaban dari pertanyaan umum</p>
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
                {faqs.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center shadow-md">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500">Belum ada FAQ</p>
                    </div>
                ) : (
                    faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full p-4 flex items-center justify-between text-left"
                            >
                                <span className="font-semibold text-gray-800">{faq.question}</span>
                                <svg
                                    className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openIndex === index && (
                                <div className="px-4 pb-4 border-t">
                                    <div
                                        className="text-sm text-gray-600 pt-3"
                                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Contact Support */}
            <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">Butuh bantuan lebih?</p>
                        <p className="text-xs text-gray-600 mt-1">Hubungi kami di support@mixue.id</p>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
