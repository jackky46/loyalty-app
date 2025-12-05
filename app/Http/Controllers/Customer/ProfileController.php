<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\ContentBlock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $customer = $user->customer;
        
        // Get birthday reward setting
        $birthdayRewardStamps = (int) \App\Models\SystemSetting::get('BIRTHDAY_REWARD_STAMPS', 2);
        
        // Check if reward already claimed
        $birthdayRewardClaimed = $customer && !is_null($customer->last_birthday_gift_year);

        // Get dynamic content
        $content = ContentBlock::active()
            ->where('category', 'profile')
            ->get()
            ->mapWithKeys(fn($c) => [$c->key => $c->content]);

        return Inertia::render('Customer/Profile', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'member_id' => $user->member_id,
                'phone' => $user->phone ?? null,
                'birth_date' => $user->birth_date?->format('Y-m-d'),
                'profile_photo' => $user->profile_photo ? Storage::url($user->profile_photo) : null,
                'created_at' => $user->created_at,
            ],
            'customer' => $customer ? [
                'current_stamps' => $customer->current_stamps,
                'total_stamps_earned' => $customer->total_stamps_earned,
                'total_stamps_used' => $customer->total_stamps_used,
            ] : null,
            'birthdayRewardStamps' => $birthdayRewardStamps,
            'birthdayRewardClaimed' => $birthdayRewardClaimed,
            'content' => $content,
        ]);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        // Delete old photo if exists
        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        // Store new photo
        $path = $request->file('photo')->store('profile-photos', 'public');
        
        $user->profile_photo = $path;
        $user->save();

        return back()->with('success', 'Foto profil berhasil diperbarui!');
    }
}
