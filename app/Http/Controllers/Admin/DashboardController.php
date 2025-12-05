<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Location;
use App\Models\Transaction;
use App\Models\Voucher;
use App\Models\Redemption;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Overall stats
        $stats = [
            'totalCustomers' => Customer::count(),
            'totalTransactions' => Transaction::count(),
            'totalStamps' => Customer::sum('total_stamps_earned'),
            'activeVouchers' => Voucher::where('status', 'ACTIVE')->count(),
            'totalRevenue' => Transaction::sum('total_amount'),
            'totalRedemptions' => Redemption::count(),
        ];

        // Today stats
        $todayStats = [
            'transactions' => Transaction::whereDate('transaction_date', today())->count(),
            'stamps' => Transaction::whereDate('transaction_date', today())->sum('stamps_earned'),
            'redemptions' => Redemption::whereDate('redeemed_at', today())->count(),
            'newCustomers' => User::where('role', 'CUSTOMER')
                ->whereDate('created_at', today())
                ->count(),
            'revenue' => Transaction::whereDate('transaction_date', today())->sum('total_amount'),
        ];

        // Chart data - last 7 days
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $chartData[] = [
                'date' => $date->format('d M'),
                'fullDate' => $date->format('Y-m-d'),
                'transactions' => Transaction::whereDate('transaction_date', $date)->count(),
                'stamps' => (int) Transaction::whereDate('transaction_date', $date)->sum('stamps_earned'),
                'revenue' => (int) Transaction::whereDate('transaction_date', $date)->sum('total_amount'),
                'redemptions' => Redemption::whereDate('redeemed_at', $date)->count(),
                'newCustomers' => User::where('role', 'CUSTOMER')
                    ->whereDate('created_at', $date)
                    ->count(),
            ];
        }

        // Top performing locations
        $topLocations = Location::select('locations.id', 'locations.name')
            ->selectRaw('COUNT(transactions.id) as transactions_count')
            ->selectRaw('COALESCE(SUM(transactions.total_amount), 0) as total_revenue')
            ->leftJoin('transactions', 'locations.id', '=', 'transactions.location_id')
            ->groupBy('locations.id', 'locations.name')
            ->orderByDesc('transactions_count')
            ->take(5)
            ->get()
            ->map(fn($loc) => [
                'name' => $loc->name,
                'transactions' => $loc->transactions_count,
                'revenue' => (int) $loc->total_revenue,
            ]);

        // Recent activity
        $recentTransactions = Transaction::with(['customer.user', 'location'])
            ->latest('transaction_date')
            ->take(5)
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'customer' => $t->customer?->user?->name ?? 'Unknown',
                'location' => $t->location?->name ?? 'Unknown',
                'amount' => $t->total_amount,
                'stamps' => $t->stamps_earned,
                'date' => $t->transaction_date,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'user' => $user,
            'stats' => $stats,
            'todayStats' => $todayStats,
            'chartData' => $chartData,
            'topLocations' => $topLocations,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}
