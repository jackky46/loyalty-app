<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use App\Models\ContentBlock;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class VoucherController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $customer = $user->customer;

        $vouchers = $customer?->vouchers()
            ->where('status', 'ACTIVE')
            ->where('expires_at', '>', now())
            ->orderBy('expires_at')
            ->get() ?? collect();

        // Get dynamic content
        $content = ContentBlock::active()
            ->where('category', 'voucher')
            ->get()
            ->mapWithKeys(fn($c) => [$c->key => $c->content]);

        return Inertia::render('Customer/Vouchers', [
            'vouchers' => $vouchers,
            'currentStamps' => $customer?->current_stamps ?? 0,
            'content' => $content,
        ]);
    }

    public function exchange(Request $request)
    {
        $request->validate([
            'stamps' => 'required|in:5,10',
        ]);

        $user = $request->user();
        $customer = $user->customer;
        $stampsToUse = (int) $request->stamps;

        if (!$customer) {
            return back()->withErrors(['error' => 'Customer profile not found']);
        }

        if ($customer->current_stamps < $stampsToUse) {
            return back()->withErrors(['error' => 'Insufficient stamps']);
        }

        // Create voucher
        $voucher = Voucher::create([
            'customer_id' => $customer->id,
            'code' => 'VCR-' . strtoupper(Str::random(8)),
            'stamps_used' => $stampsToUse,
            'status' => 'ACTIVE',
            'qr_code_data' => 'VOUCHER:' . Str::uuid(),
            'expires_at' => Carbon::now()->addDays(30),
        ]);

        // Deduct stamps
        $customer->update([
            'current_stamps' => $customer->current_stamps - $stampsToUse,
            'total_stamps_used' => $customer->total_stamps_used + $stampsToUse,
        ]);

        return back()->with('success', 'Voucher created successfully');
    }
}
