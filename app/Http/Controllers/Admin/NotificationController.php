<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Notifications');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|string',
            'target_type' => 'required|in:broadcast,role,specific',
            'target_role' => 'nullable|string',
            'user_id' => 'nullable|integer|exists:users,id',
            'action_url' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        $notificationData = [
            'title' => $request->title,
            'message' => $request->message,
            'type' => $request->type,
            'action_url' => $request->action_url,
            'image_url' => $request->image_url,
            'is_read' => false,
        ];

        if ($request->target_type === 'broadcast') {
            // Send to all users
            $users = User::where('is_active', true)->get();
            foreach ($users as $user) {
                Notification::create(array_merge($notificationData, ['user_id' => $user->id]));
            }
            $message = "Notification sent to {$users->count()} users";
        } elseif ($request->target_type === 'role') {
            // Send to specific role
            $users = User::where('role', $request->target_role)->where('is_active', true)->get();
            foreach ($users as $user) {
                Notification::create(array_merge($notificationData, ['user_id' => $user->id]));
            }
            $message = "Notification sent to {$users->count()} {$request->target_role} users";
        } else {
            // Send to specific user
            Notification::create(array_merge($notificationData, ['user_id' => $request->user_id]));
            $message = "Notification sent to user";
        }

        return back()->with('success', $message);
    }
}
