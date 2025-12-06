<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\User;
use App\Models\Customer;

return new class extends Migration
{
    /**
     * Create Customer records for existing CUSTOMER users who don't have one.
     */
    public function up(): void
    {
        $users = User::where('role', 'CUSTOMER')
            ->whereDoesntHave('customer')
            ->get();

        foreach ($users as $user) {
            Customer::create([
                'user_id' => $user->id,
                'current_stamps' => 0,
                'total_stamps_earned' => 0,
                'total_stamps_used' => 0,
                'member_since' => $user->created_at ?? now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nothing to reverse
    }
};
