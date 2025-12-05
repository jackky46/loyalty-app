<?php

namespace App\Http\Controllers\Cashier;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use App\Models\Redemption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RedeemController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Cashier/Redeem');
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $user = $request->user();
        $employee = $user->employee;

        // Find voucher
        $voucher = Voucher::where('code', $request->code)
            ->where('status', 'ACTIVE')
            ->where('expires_at', '>', now())
            ->first();
        
        if (!$voucher) {
            return back()->withErrors(['message' => 'Voucher tidak valid atau sudah digunakan']);
        }

        DB::beginTransaction();
        try {
            // Mark voucher as used
            $voucher->update([
                'status' => 'USED',
                'redeemed_at' => now(),
                'location_id' => $employee?->location_id,
            ]);

            // Create redemption record
            Redemption::create([
                'voucher_id' => $voucher->id,
                'customer_id' => $voucher->customer_id,
                'cashier_id' => $employee?->id,
                'location_id' => $employee?->location_id,
                'redeemed_at' => now(),
            ]);

            DB::commit();

            return back()->with('success', 'Voucher berhasil ditukar!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Gagal memproses penukaran: ' . $e->getMessage()]);
        }
    }
}
