<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Popup;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PopupController extends Controller
{
    public function index(): Response
    {
        $popups = Popup::withCount('views')
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Popups', [
            'popups' => $popups,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image_url' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'target_role' => 'nullable|string',
            'frequency' => 'required|in:ONCE,DAILY,ALWAYS',
            'action_label' => 'nullable|string',
            'action_url' => 'nullable|string',
            'priority' => 'integer',
            'is_active' => 'boolean',
        ]);

        Popup::create([
            'title' => $request->title,
            'content' => $request->content,
            'image_url' => $request->image_url,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'target_role' => $request->target_role ?: null,
            'frequency' => $request->frequency,
            'action_label' => $request->action_label,
            'action_url' => $request->action_url,
            'priority' => $request->priority ?? 0,
            'is_active' => $request->is_active ?? true,
        ]);

        return back()->with('success', 'Popup created successfully');
    }

    public function update(Request $request, Popup $popup)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image_url' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'target_role' => 'nullable|string',
            'frequency' => 'required|in:ONCE,DAILY,ALWAYS',
            'action_label' => 'nullable|string',
            'action_url' => 'nullable|string',
            'priority' => 'integer',
            'is_active' => 'boolean',
        ]);

        $popup->update([
            'title' => $request->title,
            'content' => $request->content,
            'image_url' => $request->image_url,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'target_role' => $request->target_role ?: null,
            'frequency' => $request->frequency,
            'action_label' => $request->action_label,
            'action_url' => $request->action_url,
            'priority' => $request->priority ?? 0,
            'is_active' => $request->is_active ?? true,
        ]);

        return back()->with('success', 'Popup updated successfully');
    }

    public function destroy(Popup $popup)
    {
        $popup->delete();

        return back()->with('success', 'Popup deleted successfully');
    }
}
