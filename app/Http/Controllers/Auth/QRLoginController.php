<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class QRLoginController extends Controller
{
    public function showQRLogin()
    {
        return Inertia::render('Auth/QRLogin');
    }

    /**
     * Start waiting mode - customer enters email/phone and waits for cashier to scan
     */
    public function startWaiting(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
        ]);

        // Find user by email, phone, or member_id
        $user = User::where('email', $request->identifier)
            ->orWhere('phone', $request->identifier)
            ->orWhere('member_id', $request->identifier)
            ->where('role', 'CUSTOMER')
            ->where('is_active', true)
            ->first();

        if (!$user || !$user->customer) {
            return response()->json([
                'error' => 'Akun tidak ditemukan. Pastikan email/HP benar.'
            ], 404);
        }

        // Store waiting status in cache (expires in 5 minutes)
        $cacheKey = "qr_login_waiting_{$user->customer->id}";
        Cache::put($cacheKey, [
            'user_id' => $user->id,
            'customer_id' => $user->customer->id,
            'waiting_since' => now(),
            'approved' => false,
        ], 300);

        return response()->json([
            'success' => true,
            'customerId' => $user->customer->id,
            'message' => 'Waiting mode aktif. Tunjukkan QR ke kasir.'
        ]);
    }

    /**
     * Check if waiting customer has been approved by cashier
     */
    public function checkWaiting(Request $request)
    {
        $customerId = $request->query('customerId');
        
        if (!$customerId) {
            return response()->json(['error' => 'Customer ID required'], 400);
        }

        $cacheKey = "qr_login_waiting_{$customerId}";
        $waitingData = Cache::get($cacheKey);

        if (!$waitingData) {
            return response()->json([
                'loginApproved' => false,
                'error' => 'Waiting session expired'
            ]);
        }

        if ($waitingData['approved']) {
            // Clear the waiting status
            Cache::forget($cacheKey);
            
            // Log the user in
            $user = User::find($waitingData['user_id']);
            if ($user) {
                Auth::login($user, true);
            }

            return response()->json([
                'loginApproved' => true,
            ]);
        }

        return response()->json([
            'loginApproved' => false,
            'waiting' => true,
        ]);
    }

    /**
     * Approve QR login - called when cashier scans a waiting customer's QR
     */
    public function approveLogin(Request $request)
    {
        $request->validate([
            'member_id' => 'required|string',
        ]);

        // Find customer by member_id
        $user = User::where('member_id', $request->member_id)
            ->where('role', 'CUSTOMER')
            ->where('is_active', true)
            ->first();

        if (!$user || !$user->customer) {
            return response()->json([
                'error' => 'Customer tidak ditemukan',
                'waiting' => false,
            ], 404);
        }

        $cacheKey = "qr_login_waiting_{$user->customer->id}";
        $waitingData = Cache::get($cacheKey);

        if (!$waitingData) {
            return response()->json([
                'waiting' => false,
                'message' => 'Customer tidak dalam waiting mode',
            ]);
        }

        // Approve the login
        $waitingData['approved'] = true;
        Cache::put($cacheKey, $waitingData, 60); // Keep for 1 minute for customer to pick up

        return response()->json([
            'success' => true,
            'waiting' => true,
            'approved' => true,
            'customer' => [
                'id' => $user->customer->id,
                'name' => $user->name,
                'member_id' => $user->member_id,
                'current_stamps' => $user->customer->current_stamps,
            ],
            'message' => 'Login disetujui! Customer akan otomatis masuk.',
        ]);
    }
}
