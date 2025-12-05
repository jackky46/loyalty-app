<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailTemplateController extends Controller
{
    public function index(): Response
    {
        $templates = EmailTemplate::orderBy('name')->get();

        return Inertia::render('Admin/EmailTemplates', [
            'templates' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:email_templates,name',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'is_active' => 'boolean',
        ]);

        EmailTemplate::create([
            'name' => $request->name,
            'subject' => $request->subject,
            'content' => $request->content,
            'is_active' => $request->is_active ?? true,
        ]);

        return back()->with('success', 'Email template created successfully');
    }

    public function update(Request $request, EmailTemplate $emailTemplate)
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:email_templates,name,' . $emailTemplate->id,
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $emailTemplate->update([
            'name' => $request->name,
            'subject' => $request->subject,
            'content' => $request->content,
            'is_active' => $request->is_active ?? true,
        ]);

        return back()->with('success', 'Email template updated successfully');
    }

    public function destroy(EmailTemplate $emailTemplate)
    {
        $emailTemplate->delete();

        return back()->with('success', 'Email template deleted successfully');
    }

    public function preview(Request $request)
    {
        $content = $request->input('content', '');
        $subject = $request->input('subject', '');


        // Sample variables for preview
        $variables = [
            'name' => 'John Doe',
            'member_id' => 'MXU-2024-00001',
            'stamps' => '5',
            'voucher_name' => 'Free Ice Cream',
            'expiry_date' => date('d/m/Y', strtotime('+30 days')),
        ];

        $renderedContent = $content;
        $renderedSubject = $subject;
        foreach ($variables as $key => $value) {
            $renderedContent = str_replace('{{' . $key . '}}', $value, $renderedContent);
            $renderedSubject = str_replace('{{' . $key . '}}', $value, $renderedSubject);
        }

        return response()->json([
            'subject' => $renderedSubject,
            'content' => $renderedContent,
        ]);
    }
}
