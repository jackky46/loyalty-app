<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(): Response
    {
        $customers = Customer::with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'current_stamps' => $customer->current_stamps,
                    'total_stamps_earned' => $customer->total_stamps_earned,
                    'total_stamps_used' => $customer->total_stamps_used,
                    'member_since' => $customer->created_at,
                    'user' => [
                        'id' => $customer->user->id,
                        'name' => $customer->user->name,
                        'email' => $customer->user->email,
                        'phone' => $customer->user->phone,
                        'member_id' => $customer->user->member_id,
                        'is_active' => $customer->user->is_active,
                    ],
                ];
            });

        return Inertia::render('Admin/Customers', [
            'customers' => $customers,
        ]);
    }

    public function adjustStamp(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'adjustment' => 'required|integer',
            'reason' => 'required|string',
        ]);

        $customer = Customer::findOrFail($request->customer_id);

        DB::beginTransaction();
        try {
            $newStamps = $customer->current_stamps + $request->adjustment;
            
            if ($newStamps < 0) {
                return back()->withErrors(['message' => 'Cannot have negative stamps']);
            }

            $customer->update([
                'current_stamps' => $newStamps,
                'total_stamps_earned' => $request->adjustment > 0 
                    ? $customer->total_stamps_earned + $request->adjustment 
                    : $customer->total_stamps_earned,
                'total_stamps_used' => $request->adjustment < 0 
                    ? $customer->total_stamps_used + abs($request->adjustment) 
                    : $customer->total_stamps_used,
            ]);

            // TODO: Log the adjustment

            DB::commit();

            return back()->with('success', 'Stamps adjusted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Failed to adjust stamps']);
        }
    }

    public function toggleActive(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'is_active' => 'required|boolean',
        ]);

        $user = User::findOrFail($request->user_id);
        $user->update(['is_active' => $request->is_active]);

        return back()->with('success', 'Customer status updated');
    }

    public function destroy(Customer $customer)
    {
        DB::beginTransaction();
        try {
            $user = $customer->user;
            
            // Delete customer first (has foreign key to user)
            $customer->delete();
            
            // Then delete user
            if ($user) {
                $user->delete();
            }
            
            DB::commit();
            return back()->with('success', 'Customer deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Failed to delete customer: ' . $e->getMessage()]);
        }
    }
}
