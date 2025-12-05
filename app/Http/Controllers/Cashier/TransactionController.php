<?php

namespace App\Http\Controllers\Cashier;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'member_id' => 'required|string',
            'amount' => 'required|integer|min:15000',
        ]);

        $user = $request->user();
        $employee = $user->employee;

        // Find customer by member_id
        $customerUser = User::where('member_id', $request->member_id)->first();
        
        if (!$customerUser || !$customerUser->customer) {
            return back()->withErrors(['message' => 'Customer tidak ditemukan']);
        }

        $customer = $customerUser->customer;

        DB::beginTransaction();
        try {
            // Create transaction
            $transaction = Transaction::create([
                'customer_id' => $customer->id,
                'cashier_id' => $employee?->id,
                'location_id' => $employee?->location_id,
                'total_amount' => $request->amount,
                'stamps_earned' => 1,
                'transaction_date' => now(),
            ]);

            // Update customer stamps
            $customer->update([
                'current_stamps' => $customer->current_stamps + 1,
                'total_stamps_earned' => $customer->total_stamps_earned + 1,
            ]);

            DB::commit();

            return back()->with('success', 'Transaksi berhasil! Customer mendapat +1 stamp.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Gagal memproses transaksi: ' . $e->getMessage()]);
        }
    }
}
