<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\ContentBlock;
use App\Models\Location;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Str;

class QRCodeController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $customer = $user->customer;

        // Get dynamic content
        $content = ContentBlock::active()
            ->where('category', 'qr')
            ->get()
            ->mapWithKeys(fn($c) => [$c->key => $c->content]);

        return Inertia::render('Customer/QRCode', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'member_id' => $user->member_id,
                'phone' => $user->phone,
                'email' => $user->email,
                'qr_code_data' => $user->qr_code_data,
            ],
            'currentStamps' => $customer?->current_stamps ?? 0,
            'content' => $content,
        ]);
    }
}
