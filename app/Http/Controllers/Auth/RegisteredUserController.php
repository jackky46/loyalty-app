<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|lowercase|email|max:255|unique:'.User::class,
            'phone' => 'nullable|string|max:20|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Require either email or phone
        if (empty($request->email) && empty($request->phone)) {
            return back()->withErrors(['email' => 'Email atau nomor HP harus diisi']);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'CUSTOMER',
        ]);

        // Create Customer record (required for stamp system)
        \App\Models\Customer::create([
            'user_id' => $user->id,
            'current_stamps' => 0,
            'total_stamps_earned' => 0,
            'total_stamps_used' => 0,
            'member_since' => now(),
        ]);

        event(new Registered($user));

        // Redirect to login with success message (like old app)
        return redirect()->route('login')->with('success', 'Registrasi berhasil! Silakan login.');
    }
}
