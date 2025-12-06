<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QRLoginController extends Controller
{
    public function showQRLogin()
    {
        return Inertia::render('Auth/QRLogin');
    }

    public function login(Request $request)
    {
        $request->validate([
            'member_id' => 'required|string',
        ]);

        $user = User::where('member_id', $request->member_id)
            ->where('role', 'CUSTOMER')
            ->where('is_active', true)
            ->first();

        if (!$user) {
            return back()->withErrors([
                'member_id' => 'Member ID tidak ditemukan atau tidak aktif',
            ]);
        }

        Auth::login($user, true); // Remember login

        return redirect()->intended('/customer/dashboard');
    }
}
