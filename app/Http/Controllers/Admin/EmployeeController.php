<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Location;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(): Response
    {
        $employees = Employee::with(['user', 'location'])
            ->orderBy('created_at', 'desc')
            ->get();

        $locations = Location::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Employees', [
            'employees' => $employees,
            'locations' => $locations,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:CASHIER,MANAGER',
            'location_id' => 'nullable|exists:locations,id',
        ]);

        DB::beginTransaction();
        try {
            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'is_active' => true,
            ]);

            // Create employee
            Employee::create([
                'user_id' => $user->id,
                'location_id' => $request->location_id,
                'position' => $request->role,
            ]);

            DB::commit();

            return back()->with('success', 'Employee created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Failed to create employee']);
        }
    }

    public function update(Request $request, Employee $employee)
    {
        $request->validate([
            'location_id' => 'nullable|exists:locations,id',
            'password' => 'nullable|string|min:6',
        ]);

        DB::beginTransaction();
        try {
            $employee->update([
                'location_id' => $request->location_id,
            ]);

            if ($request->password) {
                $employee->user->update([
                    'password' => Hash::make($request->password),
                ]);
            }

            DB::commit();

            return back()->with('success', 'Employee updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Failed to update employee']);
        }
    }

    public function destroy(Employee $employee)
    {
        DB::beginTransaction();
        try {
            $userId = $employee->user_id;
            $employee->delete();
            User::destroy($userId);

            DB::commit();

            return back()->with('success', 'Employee deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Failed to delete employee']);
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

        return back()->with('success', 'Employee status updated');
    }
}
