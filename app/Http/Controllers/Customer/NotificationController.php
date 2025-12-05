<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $notifications = $user->notifications()
            ->latest()
            ->take(50)
            ->get();

        $unreadCount = $user->notifications()
            ->where('is_read', false)
            ->count();

        return Inertia::render('Customer/Notifications', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();

        $notification = $user->notifications()->findOrFail($id);
        $notification->update(['is_read' => true]);

        return back();
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        $user->notifications()
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return back();
    }
}
