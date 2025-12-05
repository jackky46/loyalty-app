import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

type ReportType = 'sales' | 'customers' | 'employees' | 'locations';

interface Props {
    initialReport?: any;
}

export default function Reports({ initialReport }: Props) {
    const [reportType, setReportType] = useState<ReportType>('sales');
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [reportData, setReportData] = useState<any>(initialReport || null);
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/reports?type=${reportType}&start_date=${startDate}&end_date=${endDate}`);
            if (res.ok) {
                const data = await res.json();
                setReportData(data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [reportType, startDate, endDate]);

    const exportCSV = () => {
        if (!reportData?.data) return;

        const headers = Object.keys(reportData.data[0] || {});
        const csvContent = [
            headers.join(','),
            ...reportData.data.map((row: any) =>
                headers.map(h => `"${row[h] ?? ''}"`).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${reportType}_report_${startDate}_${endDate}.csv`;
        link.click();
    };

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    return (
        <AdminLayout title="Reports">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value as ReportType)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="sales">Sales Report</option>
                            <option value="customers">Customer Report</option>
                            <option value="employees">Employee Report</option>
                            <option value="locations">Location Report</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="flex items-end space-x-2">
                        <button
                            onClick={exportCSV}
                            disabled={!reportData?.data?.length}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>CSV</span>
                        </button>
                        <a
                            href={`/admin/reports/export-pdf?type=${reportType}&start_date=${startDate}&end_date=${endDate}`}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span>PDF</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            {reportData?.summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {Object.entries(reportData.summary).map(([key, value]) => (
                        <div key={key} className="bg-white rounded-xl shadow-md p-4">
                            <p className="text-sm text-gray-500 capitalize mb-1">
                                {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {typeof value === 'number'
                                    ? (key.includes('amount') || key.includes('total') && !key.includes('count')
                                        ? formatRupiah(value)
                                        : value.toLocaleString('id-ID'))
                                    : String(value)}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Data Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            ) : reportData?.data?.length > 0 ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    {Object.keys(reportData.data[0] || {}).map((header) => (
                                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            {header.replace(/_/g, ' ')}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {reportData.data.map((row: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        {Object.entries(row).map(([key, cell]: [string, any], cellIdx: number) => (
                                            <td key={cellIdx} className="px-6 py-4 text-sm text-gray-900">
                                                {typeof cell === 'number'
                                                    ? (key.includes('amount') || key.includes('price')
                                                        ? formatRupiah(cell)
                                                        : cell.toLocaleString('id-ID'))
                                                    : cell?.toString() || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">No data available for the selected period</p>
                </div>
            )}
        </AdminLayout>
    );
}
