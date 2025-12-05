<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        $userRole = $request->user()->role;

        // Check if user has any of the allowed roles
        if (!in_array($userRole, $roles)) {
            // Redirect based on user's actual role
            return $this->redirectToRoleDashboard($userRole);
        }

        return $next($request);
    }

    /**
     * Redirect user to their role-specific dashboard
     */
    protected function redirectToRoleDashboard(string $role): Response
    {
        return match ($role) {
            'SUPER_ADMIN', 'ADMIN' => redirect()->route('admin.dashboard'),
            'MANAGER', 'CASHIER' => redirect()->route('cashier.dashboard'),
            'CUSTOMER' => redirect()->route('customer.dashboard'),
            default => redirect()->route('login'),
        };
    }
}
