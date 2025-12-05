<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Http\Request;

class LookupController extends Controller
{
    public function customerByMemberId(Request $request)
    {
        $memberId = $request->query('member_id');
        
        if (!$memberId) {
            return response()->json(['message' => 'Member ID required'], 400);
        }

        $user = User::where('member_id', $memberId)
            ->where('role', 'CUSTOMER')
            ->where('is_active', true)
            ->first();

        if (!$user || !$user->customer) {
            return response()->json(['message' => 'Customer tidak ditemukan'], 404);
        }

        return response()->json([
            'customer' => [
                'id' => $user->customer->id,
                'current_stamps' => $user->customer->current_stamps,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'member_id' => $user->member_id,
                ],
            ],
        ]);
    }

    public function voucherByCode(Request $request)
    {
        $code = $request->query('code');
        
        if (!$code) {
            return response()->json(['message' => 'Voucher code required'], 400);
        }

        $voucher = Voucher::where('code', $code)
            ->where('status', 'ACTIVE')
            ->where('expires_at', '>', now())
            ->with(['customer.user'])
            ->first();

        if (!$voucher) {
            return response()->json(['message' => 'Voucher tidak ditemukan atau sudah digunakan'], 404);
        }

        return response()->json([
            'voucher' => [
                'id' => $voucher->id,
                'code' => $voucher->code,
                'stamps_used' => $voucher->stamps_used,
                'expires_at' => $voucher->expires_at,
                'customer' => [
                    'id' => $voucher->customer->id,
                    'user' => [
                        'name' => $voucher->customer->user->name,
                        'member_id' => $voucher->customer->user->member_id,
                    ],
                ],
            ],
        ]);
    }
}
