<?php

namespace Database\Seeders;

use App\Models\ContentBlock;
use Illuminate\Database\Seeder;

class ContentBlockSeeder extends Seeder
{
    public function run(): void
    {
        $contents = [
            // Home page content
            [
                'key' => 'home_tips_title',
                'category' => 'home',
                'title' => 'Tips Title',
                'content' => 'Cara Dapat Stamp',
                'is_active' => true,
            ],
            [
                'key' => 'home_tips_content',
                'category' => 'home',
                'title' => 'Tips Content',
                'content' => 'Setiap 1x pembelian minimal Rp 15.000 = 1 stamp. Kumpulkan 5 atau 10 stamp untuk FREE product!',
                'is_active' => true,
            ],
            [
                'key' => 'home_stamp_info',
                'category' => 'home',
                'title' => 'Stamp Info',
                'content' => 'Dapatkan 1 stempel setiap pembelian min. Rp 15.000',
                'is_active' => true,
            ],
            [
                'key' => 'home_5_stamps_reward',
                'category' => 'home',
                'title' => '5 Stamps Reward',
                'content' => 'FREE DRINK max Rp 22k',
                'is_active' => true,
            ],
            [
                'key' => 'home_10_stamps_reward',
                'category' => 'home',
                'title' => '10 Stamps Reward',
                'content' => 'FREE ITEM max Rp 22k',
                'is_active' => true,
            ],

            // Voucher page content
            [
                'key' => 'voucher_empty_message',
                'category' => 'voucher',
                'title' => 'Empty Voucher Message',
                'content' => 'Belum ada voucher yang tersedia. Kumpulkan stamp untuk mendapatkan voucher gratis!',
                'is_active' => true,
            ],
            [
                'key' => 'voucher_exchange_info',
                'category' => 'voucher',
                'title' => 'Exchange Info',
                'content' => 'Tukarkan stamps kamu untuk mendapatkan voucher gratis!',
                'is_active' => true,
            ],

            // Profile page content
            [
                'key' => 'profile_birthday_reward',
                'category' => 'profile',
                'title' => 'Birthday Reward',
                'content' => 'Tambahkan tanggal lahir untuk dapat bonus stamp!',
                'is_active' => true,
            ],

            // Info/Tips
            [
                'key' => 'tips_how_to_scan',
                'category' => 'tips',
                'title' => 'Cara Scan',
                'content' => 'Tunjukkan QR Code ke kasir saat transaksi untuk mendapatkan stamp.',
                'is_active' => true,
            ],
            [
                'key' => 'tips_stamp_expiry',
                'category' => 'tips',
                'title' => 'Masa Berlaku Stamp',
                'content' => 'Stamp berlaku selama 90 hari sejak tanggal diperoleh.',
                'is_active' => true,
            ],

            // Promo
            [
                'key' => 'promo_banner_text',
                'category' => 'promo',
                'title' => 'Promo Banner',
                'content' => 'Promo spesial! Dapatkan double stamp setiap hari Jumat!',
                'is_active' => false, // Disabled by default
            ],

            // QR Code page content
            [
                'key' => 'qr_instruction',
                'category' => 'qr',
                'title' => 'QR Instruction',
                'content' => 'Tunjukkan QR Code ini ke kasir saat transaksi untuk mendapatkan stamp.',
                'is_active' => true,
            ],
            [
                'key' => 'qr_scan_tips',
                'category' => 'qr',
                'title' => 'Scan Tips',
                'content' => 'Pastikan QR Code terlihat jelas dan tidak tertutup.',
                'is_active' => true,
            ],

            // More Profile content
            [
                'key' => 'profile_member_benefits',
                'category' => 'profile',
                'title' => 'Member Benefits',
                'content' => '<strong>Keuntungan Member:</strong><ul><li>Kumpulkan stamp setiap transaksi</li><li>Tukar stamp dengan voucher gratis</li><li>Bonus stamp di hari ulang tahun</li></ul>',
                'is_active' => true,
            ],

            // Cashier announcements
            [
                'key' => 'cashier_announcement',
                'category' => 'cashier',
                'title' => 'Pengumuman Karyawan',
                'content' => 'Selamat datang! Pastikan selalu scan QR customer sebelum transaksi untuk memberikan stamp dengan benar.',
                'is_active' => true,
            ],
        ];

        foreach ($contents as $content) {
            ContentBlock::updateOrCreate(
                ['key' => $content['key']],
                $content
            );
        }
    }
}
