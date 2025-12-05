<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\Location;
use App\Models\Transaction;
use App\Models\Redemption;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Reports');
    }

    public function getData(Request $request)
    {
        $type = $request->query('type', 'sales');
        $startDate = $request->query('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->query('end_date', now()->format('Y-m-d'));

        switch ($type) {
            case 'sales':
                return $this->getSalesReport($startDate, $endDate);
            case 'customers':
                return $this->getCustomerReport($startDate, $endDate);
            case 'employees':
                return $this->getEmployeeReport($startDate, $endDate);
            case 'locations':
                return $this->getLocationReport($startDate, $endDate);
            default:
                return response()->json(['error' => 'Invalid report type'], 400);
        }
    }

    private function getSalesReport($startDate, $endDate)
    {
        $transactions = Transaction::with(['customer.user', 'location'])
            ->whereBetween('transaction_date', [$startDate, $endDate . ' 23:59:59'])
            ->orderBy('transaction_date', 'desc')
            ->get();

        $summary = [
            'total_transactions' => $transactions->count(),
            'total_amount' => $transactions->sum('total_amount'),
            'total_stamps' => $transactions->sum('stamps_earned'),
            'avg_transaction' => $transactions->count() > 0 
                ? round($transactions->sum('total_amount') / $transactions->count()) 
                : 0,
        ];

        $data = $transactions->map(function ($t) {
            return [
                'date' => $t->transaction_date->format('Y-m-d H:i'),
                'customer' => $t->customer?->user?->name ?? 'Guest',
                'location' => $t->location?->name ?? '-',
                'amount' => $t->total_amount,
                'stamps' => $t->stamps_earned,
            ];
        });

        return response()->json([
            'summary' => $summary,
            'data' => $data,
        ]);
    }

    private function getCustomerReport($startDate, $endDate)
    {
        $customers = Customer::with('user')
            ->whereHas('user', function ($q) use ($startDate, $endDate) {
                $q->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59']);
            })
            ->orWhere(function ($q) {
                $q->where('current_stamps', '>', 0);
            })
            ->get();

        $newCustomers = User::where('role', 'CUSTOMER')
            ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
            ->count();

        $summary = [
            'total_customers' => Customer::count(),
            'new_customers' => $newCustomers,
            'total_stamps' => Customer::sum('current_stamps'),
            'avg_stamps' => round(Customer::avg('current_stamps') ?? 0, 1),
        ];

        $data = $customers->take(100)->map(function ($c) {
            return [
                'name' => $c->user?->name ?? '-',
                'email' => $c->user?->email ?? '-',
                'member_id' => $c->user?->member_id ?? '-',
                'current_stamps' => $c->current_stamps,
                'total_earned' => $c->total_stamps_earned,
                'registered' => $c->created_at->format('Y-m-d'),
            ];
        });

        return response()->json([
            'summary' => $summary,
            'data' => $data,
        ]);
    }

    private function getEmployeeReport($startDate, $endDate)
    {
        $employees = Employee::with(['user', 'location'])
            ->get();

        $summary = [
            'total_employees' => $employees->count(),
            'cashiers' => $employees->where('position', 'CASHIER')->count(),
            'managers' => $employees->where('position', 'MANAGER')->count(),
            'unassigned' => $employees->whereNull('location_id')->count(),
        ];

        $data = $employees->map(function ($e) use ($startDate, $endDate) {
            $transactionCount = Transaction::where('cashier_id', $e->id)
                ->whereBetween('transaction_date', [$startDate, $endDate . ' 23:59:59'])
                ->count();

            return [
                'name' => $e->user?->name ?? '-',
                'email' => $e->user?->email ?? '-',
                'role' => $e->position,
                'location' => $e->location?->name ?? 'Unassigned',
                'transactions' => $transactionCount,
                'status' => $e->user?->is_active ? 'Active' : 'Inactive',
            ];
        });

        return response()->json([
            'summary' => $summary,
            'data' => $data,
        ]);
    }

    private function getLocationReport($startDate, $endDate)
    {
        $locations = Location::withCount('employees')
            ->where('is_active', true)
            ->get();

        $summary = [
            'total_locations' => $locations->count(),
            'total_employees' => $locations->sum('employees_count'),
        ];

        $data = $locations->map(function ($loc) use ($startDate, $endDate) {
            $transactionCount = Transaction::where('location_id', $loc->id)
                ->whereBetween('transaction_date', [$startDate, $endDate . ' 23:59:59'])
                ->count();
            
            $totalAmount = Transaction::where('location_id', $loc->id)
                ->whereBetween('transaction_date', [$startDate, $endDate . ' 23:59:59'])
                ->sum('total_amount');

            return [
                'name' => $loc->name,
                'city' => $loc->city,
                'employees' => $loc->employees_count,
                'transactions' => $transactionCount,
                'total_amount' => $totalAmount,
            ];
        });

        return response()->json([
            'summary' => $summary,
            'data' => $data,
        ]);
    }

    public function exportPDF(Request $request)
    {
        $type = $request->query('type', 'sales');
        $startDate = $request->query('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->query('end_date', now()->format('Y-m-d'));

        // Get report data
        $reportData = match($type) {
            'sales' => $this->getSalesReportData($startDate, $endDate),
            'customers' => $this->getCustomerReportData($startDate, $endDate),
            'employees' => $this->getEmployeeReportData($startDate, $endDate),
            'locations' => $this->getLocationReportData($startDate, $endDate),
            default => ['summary' => [], 'data' => []],
        };

        $pdf = \Barryvdh\DomPdf\Facade\Pdf::loadView('reports.pdf', [
            'type' => $type,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'summary' => $reportData['summary'],
            'data' => $reportData['data'],
        ]);

        return $pdf->download("report-{$type}-{$startDate}-to-{$endDate}.pdf");
    }

    private function getSalesReportData($startDate, $endDate)
    {
        $transactions = Transaction::with(['customer.user', 'location'])
            ->whereBetween('transaction_date', [$startDate, $endDate . ' 23:59:59'])
            ->orderBy('transaction_date', 'desc')
            ->get();

        return [
            'summary' => [
                'Total Transaksi' => $transactions->count(),
                'Total Pendapatan' => 'Rp ' . number_format($transactions->sum('total_amount'), 0, ',', '.'),
                'Total Stamps' => $transactions->sum('stamps_earned'),
                'Rata-rata' => 'Rp ' . number_format($transactions->count() > 0 ? $transactions->sum('total_amount') / $transactions->count() : 0, 0, ',', '.'),
            ],
            'data' => $transactions->take(100)->map(fn($t) => [
                'Tanggal' => $t->transaction_date->format('d/m/Y H:i'),
                'Customer' => $t->customer?->user?->name ?? 'Guest',
                'Lokasi' => $t->location?->name ?? '-',
                'Amount' => 'Rp ' . number_format($t->total_amount, 0, ',', '.'),
                'Stamps' => $t->stamps_earned,
            ])->toArray(),
        ];
    }

    private function getCustomerReportData($startDate, $endDate)
    {
        $customers = Customer::with('user')->get();

        return [
            'summary' => [
                'Total Customer' => Customer::count(),
                'Customer Baru' => User::where('role', 'CUSTOMER')->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])->count(),
                'Total Stamps' => Customer::sum('current_stamps'),
            ],
            'data' => $customers->take(50)->map(fn($c) => [
                'Nama' => $c->user?->name ?? '-',
                'Email' => $c->user?->email ?? '-',
                'Member ID' => $c->user?->member_id ?? '-',
                'Stamps' => $c->current_stamps,
            ])->toArray(),
        ];
    }

    private function getEmployeeReportData($startDate, $endDate)
    {
        $employees = Employee::with(['user', 'location'])->get();

        return [
            'summary' => [
                'Total Karyawan' => $employees->count(),
                'Cashier' => $employees->where('position', 'CASHIER')->count(),
                'Manager' => $employees->where('position', 'MANAGER')->count(),
            ],
            'data' => $employees->map(fn($e) => [
                'Nama' => $e->user?->name ?? '-',
                'Role' => $e->position,
                'Lokasi' => $e->location?->name ?? 'Unassigned',
                'Status' => $e->user?->is_active ? 'Active' : 'Inactive',
            ])->toArray(),
        ];
    }

    private function getLocationReportData($startDate, $endDate)
    {
        $locations = Location::withCount('employees')->where('is_active', true)->get();

        return [
            'summary' => [
                'Total Lokasi' => $locations->count(),
                'Total Karyawan' => $locations->sum('employees_count'),
            ],
            'data' => $locations->map(function ($loc) use ($startDate, $endDate) {
                $trxCount = Transaction::where('location_id', $loc->id)->whereBetween('transaction_date', [$startDate, $endDate . ' 23:59:59'])->count();
                $trxAmount = Transaction::where('location_id', $loc->id)->whereBetween('transaction_date', [$startDate, $endDate . ' 23:59:59'])->sum('total_amount');
                return [
                    'Nama' => $loc->name,
                    'Kota' => $loc->city,
                    'Karyawan' => $loc->employees_count,
                    'Transaksi' => $trxCount,
                    'Pendapatan' => 'Rp ' . number_format($trxAmount, 0, ',', '.'),
                ];
            })->toArray(),
        ];
    }
}

