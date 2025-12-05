<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $settings = SystemSetting::pluck('value', 'key')->toArray();
        $logoPath = $settings['BRAND_LOGO'] ?? null;

        return Inertia::render('Admin/Settings', [
            'settings' => [
                'min_transaction_amount' => $settings['MIN_TRANSACTION_AMOUNT'] ?? '15000',
                'stamps_for_small_voucher' => $settings['STAMPS_FOR_SMALL_VOUCHER'] ?? '5',
                'stamps_for_large_voucher' => $settings['STAMPS_FOR_LARGE_VOUCHER'] ?? '10',
                'voucher_expiry_days' => $settings['VOUCHER_EXPIRY_DAYS'] ?? '30',
                'max_voucher_price' => $settings['MAX_VOUCHER_PRODUCT_PRICE'] ?? '22000',
                'birthday_reward_stamps' => $settings['BIRTHDAY_REWARD_STAMPS'] ?? '2',
            ],
            'logoUrl' => $logoPath ? Storage::url($logoPath) : null,
        ]);
    }

    public function update(Request $request)
    {
        $settings = [
            'MIN_TRANSACTION_AMOUNT' => $request->min_transaction_amount,
            'STAMPS_FOR_SMALL_VOUCHER' => $request->stamps_for_small_voucher,
            'STAMPS_FOR_LARGE_VOUCHER' => $request->stamps_for_large_voucher,
            'VOUCHER_EXPIRY_DAYS' => $request->voucher_expiry_days,
            'MAX_VOUCHER_PRODUCT_PRICE' => $request->max_voucher_price,
            'BIRTHDAY_REWARD_STAMPS' => $request->birthday_reward_stamps,
        ];

        foreach ($settings as $key => $value) {
            SystemSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return back()->with('success', 'Settings saved successfully');
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Delete old logo
        $oldLogo = SystemSetting::get('BRAND_LOGO');
        if ($oldLogo) {
            Storage::disk('public')->delete($oldLogo);
        }

        // Store new logo
        $path = $request->file('logo')->store('branding', 'public');

        // Save path to settings
        SystemSetting::updateOrCreate(
            ['key' => 'BRAND_LOGO'],
            ['value' => $path]
        );

        return response()->json([
            'success' => true,
            'logoUrl' => Storage::url($path),
        ]);
    }
}

