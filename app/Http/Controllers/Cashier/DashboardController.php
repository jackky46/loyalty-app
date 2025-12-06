<?php

namespace App\Http\Controllers\Cashier;

use App\Http\Controllers\Controller;
use App\Models\ContentBlock;
use App\Models\Transaction;
use App\Models\Redemption;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $employee = $user->employee;

        // Today's stats for this cashier
        $todayStats = [
            'transactions' => Transaction::where('cashier_id', $employee?->id)
                ->whereDate('transaction_date', today())
                ->count(),
            'redemptions' => Redemption::where('cashier_id', $employee?->id)
                ->whereDate('redeemed_at', today())
                ->count(),
            'stamps' => Transaction::where('cashier_id', $employee?->id)
                ->whereDate('transaction_date', today())
                ->sum('stamps_earned'),
        ];

        // Recent transactions by this cashier
        $recentTransactions = Transaction::with(['customer.user', 'location'])
            ->where('cashier_id', $employee?->id)
            ->latest('transaction_date')
            ->take(10)
            ->get();

        // Get announcement for cashiers from CMS
        $announcement = ContentBlock::getByKey('cashier_announcement');
        
        // Get unread notifications count
        $unreadNotifications = $user->notifications()
            ->where('is_read', false)
            ->count();

        return Inertia::render('Cashier/Dashboard', [
            'user' => $user,
            'employee' => $employee,
            'location' => $employee?->location,
            'todayStats' => $todayStats,
            'recentTransactions' => $recentTransactions,
            'announcement' => $announcement,
            'unreadNotifications' => $unreadNotifications,
        ]);
    }
}
