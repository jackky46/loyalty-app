<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $customer = $user->customer;

        // Regular transactions
        $transactions = $customer?->transactions()
            ->with('location')
            ->latest('transaction_date')
            ->take(50)
            ->get() ?? collect();

        // Voucher redemptions
        $redemptions = $customer?->vouchers()
            ->whereNotNull('used_at')
            ->with(['product', 'location'])
            ->latest('used_at')
            ->take(50)
            ->get() ?? collect();

        // Stamp rewards (stamps without transaction - birthday, bonuses, etc)
        // Get stamps where reason is NOT 'TRANSACTION' (the default for purchase stamps)
        $stampRewards = $customer?->stamps()
            ->where('reason', '!=', 'TRANSACTION')
            ->latest()
            ->take(20)
            ->get()
            ->groupBy('reason')
            ->map(function ($stamps, $reason) {
                return [
                    'id' => $stamps->first()->id,
                    'stamps_count' => $stamps->count(),
                    'reason' => $reason,
                    'created_at' => $stamps->first()->created_at,
                ];
            })
            ->values() ?? collect();

        return Inertia::render('Customer/History', [
            'transactions' => $transactions,
            'redemptions' => $redemptions,
            'stampRewards' => $stampRewards,
        ]);
    }
}
