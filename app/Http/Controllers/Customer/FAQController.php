<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\ContentBlock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FAQController extends Controller
{
    public function index(Request $request): Response
    {
        // Get FAQ content from CMS
        $faqs = ContentBlock::active()
            ->where('category', 'faq')
            ->orderBy('key')
            ->get()
            ->map(fn($c) => [
                'question' => $c->title,
                'answer' => $c->content,
            ]);

        return Inertia::render('Customer/FAQ', [
            'faqs' => $faqs,
        ]);
    }
}
