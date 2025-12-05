<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Stamp;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BirthdayController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'birth_date' => 'required|date|before:today',
        ]);

        $user = $request->user();
        $customer = $user->customer;

        // Check if user already has birth_date and already received reward
        $alreadyHasBirthday = !is_null($user->birth_date);
        $alreadyReceivedReward = $customer && !is_null($customer->last_birthday_gift_year);

        DB::transaction(function () use ($user, $customer, $request, $alreadyHasBirthday, $alreadyReceivedReward) {
            // Update birth_date
            $user->birth_date = $request->birth_date;
            $user->save();

            // Only give reward if first time setting birthday
            if (!$alreadyHasBirthday && !$alreadyReceivedReward && $customer) {
                $rewardStamps = (int) SystemSetting::get('BIRTHDAY_REWARD_STAMPS', 2);

                if ($rewardStamps > 0) {
                    // Update customer stamps
                    $customer->current_stamps += $rewardStamps;
                    $customer->total_stamps_earned += $rewardStamps;
                    $customer->last_birthday_gift_year = now()->year;
                    $customer->save();

                    // Create stamp records for history (one record per stamp)
                    for ($i = 0; $i < $rewardStamps; $i++) {
                        Stamp::create([
                            'customer_id' => $customer->id,
                            'transaction_id' => null,
                            'status' => 'active',
                            'reason' => 'BIRTHDAY_PROFILE_REWARD',
                        ]);
                    }
                }
            }
        });

        $message = $alreadyHasBirthday 
            ? 'Tanggal lahir berhasil diperbarui!' 
            : 'Tanggal lahir disimpan dan kamu mendapat bonus stamp!';

        return back()->with('success', $message);
    }
}
