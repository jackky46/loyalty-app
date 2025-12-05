<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentBlock;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ContentBlock::query();

        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('key', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $contents = $query->orderBy('category')->orderBy('key')->get();

        // Get unique categories
        $categories = ContentBlock::select('category')
            ->distinct()
            ->pluck('category')
            ->toArray();

        return Inertia::render('Admin/Content', [
            'contents' => $contents,
            'categories' => $categories,
            'filters' => [
                'category' => $request->category ?? 'all',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|max:100|unique:content_blocks,key',
            'category' => 'required|string|max:50',
            'title' => 'nullable|string|max:255',
            'content' => 'required|string',
            'is_active' => 'boolean',
        ]);

        ContentBlock::create($validated);

        return back()->with('success', 'Content berhasil ditambahkan');
    }

    public function update(Request $request, ContentBlock $content): RedirectResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|max:100|unique:content_blocks,key,' . $content->id,
            'category' => 'required|string|max:50',
            'title' => 'nullable|string|max:255',
            'content' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $content->update($validated);

        return back()->with('success', 'Content berhasil diupdate');
    }

    public function destroy(ContentBlock $content): RedirectResponse
    {
        $content->delete();

        return back()->with('success', 'Content berhasil dihapus');
    }

    public function toggleActive(ContentBlock $content): RedirectResponse
    {
        $content->update(['is_active' => !$content->is_active]);

        return back()->with('success', 'Status content diubah');
    }
}
