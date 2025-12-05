<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\ContentBlock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $customer = $user->customer;

        // Get recent transactions
        $recentTransactions = $customer?->transactions()
            ->with('location')
            ->latest('transaction_date')
            ->take(5)
            ->get() ?? collect();

        // Get active vouchers
        $activeVouchers = $customer?->vouchers()
            ->where('status', 'ACTIVE')
            ->where('expires_at', '>', now())
            ->orderBy('expires_at')
            ->get() ?? collect();

        // Get unread notifications count
        $unreadNotifications = $user->notifications()
            ->where('is_read', false)
            ->count();

        // Get recent notifications for popup
        $recentNotifications = $user->notifications()
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($n) => [
                'id' => $n->id,
                'title' => $n->title,
                'message' => $n->message,
                'read_at' => $n->is_read ? $n->updated_at : null,
                'created_at' => $n->created_at,
            ]);

        // Get dynamic content from CMS
        $content = ContentBlock::active()
            ->whereIn('category', ['home', 'tips', 'promo'])
            ->get()
            ->mapWithKeys(fn($c) => [$c->key => $c->content]);

        return Inertia::render('Customer/Dashboard', [
            'user' => $user,
            'customer' => $customer,
            'currentStamps' => $customer?->current_stamps ?? 0,
            'totalStampsEarned' => $customer?->total_stamps_earned ?? 0,
            'recentTransactions' => $recentTransactions,
            'activeVouchers' => $activeVouchers,
            'unreadNotifications' => $unreadNotifications,
            'recentNotifications' => $recentNotifications,
            'content' => $content,
        ]);
    }
}
