<?php

namespace App\Http\Controllers\Cashier;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $employee = $user->employee;

        $transactions = Transaction::with(['customer.user', 'location'])
            ->where('cashier_id', $employee?->id)
            ->latest('transaction_date')
            ->paginate(20);

        return Inertia::render('Cashier/History', [
            'transactions' => $transactions,
            'employee' => $employee,
        ]);
    }
}
