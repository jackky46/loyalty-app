<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\Location;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Super Admin
        $superAdmin = User::create([
            'role' => 'SUPER_ADMIN',
            'name' => 'Super Admin',
            'email' => 'admin@mixue.com',
            'phone' => '081234567890',
            'password' => Hash::make('password'),
            'member_id' => 'ADM-2024-00001',
            'qr_code_data' => json_encode(['type' => 'admin', 'id' => 'ADM-2024-00001']),
            'email_verified' => true,
            'is_active' => true,
        ]);

        // Create a test location first
        $location = Location::create([
            'name' => 'Mixue Central',
            'address' => 'Jl. Sudirman No. 1, Jakarta',
            'phone' => '021-1234567',
            'city' => 'Jakarta',
            'latitude' => -6.2088,
            'longitude' => 106.8456,
            'operating_hours' => json_encode([
                'mon' => '09:00-21:00',
                'tue' => '09:00-21:00',
                'wed' => '09:00-21:00',
                'thu' => '09:00-21:00',
                'fri' => '09:00-22:00',
                'sat' => '09:00-22:00',
                'sun' => '10:00-21:00',
            ]),
            'facilities' => json_encode(['wifi', 'parking', 'dine-in']),
            'is_active' => true,
        ]);

        // Create a Cashier
        $cashierUser = User::create([
            'role' => 'CASHIER',
            'name' => 'Kasir Test',
            'email' => 'kasir@mixue.com',
            'phone' => '081234567891',
            'password' => Hash::make('password'),
            'member_id' => 'KSR-2024-00001',
            'qr_code_data' => json_encode(['type' => 'employee', 'id' => 'KSR-2024-00001']),
            'email_verified' => true,
            'is_active' => true,
        ]);

        Employee::create([
            'user_id' => $cashierUser->id,
            'employee_code' => 'KSR-001',
            'location_id' => $location->id,
            'position' => 'Cashier',
            'hire_date' => now(),
            'is_active' => true,
        ]);

        // Create a Test Customer
        $customerUser = User::create([
            'role' => 'CUSTOMER',
            'name' => 'Customer Test',
            'email' => 'customer@test.com',
            'phone' => '081234567892',
            'password' => Hash::make('password'),
            'member_id' => 'MXU-2024-00001',
            'qr_code_data' => json_encode([
                'type' => 'customer',
                'member_id' => 'MXU-2024-00001',
                'customer_id' => 1,
            ]),
            'birth_date' => '1995-05-15',
            'email_verified' => true,
            'is_active' => true,
        ]);

        Customer::create([
            'user_id' => $customerUser->id,
            'current_stamps' => 3,
            'total_stamps_earned' => 8,
            'total_stamps_used' => 5,
            'member_since' => now()->subMonths(2),
            'last_transaction_at' => now()->subDays(3),
        ]);

        $this->command->info('Created test users:');
        $this->command->info('- Admin: admin@mixue.com / password');
        $this->command->info('- Cashier: kasir@mixue.com / password');
        $this->command->info('- Customer: customer@test.com / password');
    }
}
