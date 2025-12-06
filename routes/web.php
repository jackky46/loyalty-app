<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\Customer\QRCodeController;
use App\Http\Controllers\Customer\VoucherController;
use App\Http\Controllers\Customer\HistoryController;
use App\Http\Controllers\Customer\LocationController;
use App\Http\Controllers\Customer\NotificationController;
use App\Http\Controllers\Customer\ProfileController as CustomerProfileController;
use App\Http\Controllers\Customer\BirthdayController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Cashier\DashboardController as CashierDashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    // If logged in, redirect to role-specific dashboard
    if (auth()->check()) {
        return match (auth()->user()->role) {
            'SUPER_ADMIN', 'ADMIN' => redirect()->route('admin.dashboard'),
            'MANAGER', 'CASHIER' => redirect()->route('cashier.dashboard'),
            'CUSTOMER' => redirect()->route('customer.dashboard'),
            default => redirect()->route('dashboard'),
        };
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// QR Login (guest only for page, but API can be accessed by anyone)
Route::middleware('guest')->group(function () {
    Route::get('/qr-login', [\App\Http\Controllers\Auth\QRLoginController::class, 'showQRLogin'])->name('qr-login');
});

// QR Login API (no auth required for start-waiting and check-waiting)
Route::prefix('api/qr-login')->group(function () {
    Route::post('/start-waiting', [\App\Http\Controllers\Auth\QRLoginController::class, 'startWaiting']);
    Route::get('/check-waiting', [\App\Http\Controllers\Auth\QRLoginController::class, 'checkWaiting']);
    Route::post('/approve', [\App\Http\Controllers\Auth\QRLoginController::class, 'approveLogin']);
});

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'active', 'role:CUSTOMER'])
    ->prefix('customer')
    ->name('customer.')
    ->group(function () {
        Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');
        Route::get('/qrcode', [QRCodeController::class, 'index'])->name('qrcode');
        Route::get('/vouchers', [VoucherController::class, 'index'])->name('vouchers');
        Route::post('/vouchers/exchange', [VoucherController::class, 'exchange'])->name('vouchers.exchange');
        Route::get('/history', [HistoryController::class, 'index'])->name('history');
        Route::get('/locations', [LocationController::class, 'index'])->name('locations');
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications');
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
        Route::get('/profile', [CustomerProfileController::class, 'index'])->name('profile');
        Route::post('/profile/photo', [CustomerProfileController::class, 'uploadPhoto'])->name('profile.photo');
        Route::post('/birthday', [BirthdayController::class, 'update'])->name('birthday.update');
        Route::get('/faq', [\App\Http\Controllers\Customer\FAQController::class, 'index'])->name('faq');
        Route::get('/settings', function () {
            return \Inertia\Inertia::render('Customer/Settings');
        })->name('settings');

        // API for real-time stamp polling
        Route::get('/api/stamps', function () {
            $user = auth()->user();
            $customer = $user->customer;
            return response()->json([
                'current_stamps' => $customer?->current_stamps ?? 0,
                'total_stamps_earned' => $customer?->total_stamps_earned ?? 0,
            ]);
        })->name('api.stamps');
        
        // API for recording popup views
        Route::post('/api/popup-view/{popup}', function (\App\Models\Popup $popup) {
            \App\Models\PopupView::create([
                'popup_id' => $popup->id,
                'user_id' => auth()->id(),
                'viewed_at' => now(),
            ]);
            return response()->json(['success' => true]);
        })->name('api.popup-view');
    });

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\LocationController as AdminLocationController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\EmployeeController as AdminEmployeeController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Admin\PopupController as AdminPopupController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\ContentController as AdminContentController;

Route::middleware(['auth', 'active', 'role:ADMIN,SUPER_ADMIN'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        
        // Customers
        Route::get('/customers', [AdminCustomerController::class, 'index'])->name('customers');
        Route::post('/customers/adjust-stamp', [AdminCustomerController::class, 'adjustStamp'])->name('customers.adjustStamp');
        Route::post('/customers/toggle-active', [AdminCustomerController::class, 'toggleActive'])->name('customers.toggleActive');
        Route::delete('/customers/{customer}', [AdminCustomerController::class, 'destroy'])->name('customers.destroy');
        
        // Locations
        Route::get('/locations', [AdminLocationController::class, 'index'])->name('locations');
        Route::post('/locations', [AdminLocationController::class, 'store'])->name('locations.store');
        Route::put('/locations/{location}', [AdminLocationController::class, 'update'])->name('locations.update');
        Route::delete('/locations/{location}', [AdminLocationController::class, 'destroy'])->name('locations.destroy');
        
        // Products
        Route::get('/products', [AdminProductController::class, 'index'])->name('products');
        Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
        Route::put('/products/{product}', [AdminProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');
        
        // Employees
        Route::get('/employees', [AdminEmployeeController::class, 'index'])->name('employees');
        Route::post('/employees', [AdminEmployeeController::class, 'store'])->name('employees.store');
        Route::put('/employees/{employee}', [AdminEmployeeController::class, 'update'])->name('employees.update');
        Route::delete('/employees/{employee}', [AdminEmployeeController::class, 'destroy'])->name('employees.destroy');
        Route::post('/employees/toggle-active', [AdminEmployeeController::class, 'toggleActive'])->name('employees.toggleActive');
        
        // Reports
        Route::get('/reports', [AdminReportController::class, 'index'])->name('reports');
        Route::get('/reports/export-pdf', [AdminReportController::class, 'exportPDF'])->name('reports.pdf');
        
        // Notifications
        Route::get('/notifications', [AdminNotificationController::class, 'index'])->name('notifications');
        Route::post('/notifications', [AdminNotificationController::class, 'store'])->name('notifications.store');
        
        // Popups
        Route::get('/popups', [AdminPopupController::class, 'index'])->name('popups');
        Route::post('/popups', [AdminPopupController::class, 'store'])->name('popups.store');
        Route::put('/popups/{popup}', [AdminPopupController::class, 'update'])->name('popups.update');
        Route::delete('/popups/{popup}', [AdminPopupController::class, 'destroy'])->name('popups.destroy');
        
        // Content CMS
        Route::get('/content', [AdminContentController::class, 'index'])->name('content');
        Route::post('/content', [AdminContentController::class, 'store'])->name('content.store');
        Route::put('/content/{content}', [AdminContentController::class, 'update'])->name('content.update');
        Route::delete('/content/{content}', [AdminContentController::class, 'destroy'])->name('content.destroy');
        Route::post('/content/{content}/toggle', [AdminContentController::class, 'toggleActive'])->name('content.toggle');
        
        // Settings
        Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings');
        Route::put('/settings', [AdminSettingController::class, 'update'])->name('settings.update');
        Route::post('/settings/logo', [AdminSettingController::class, 'uploadLogo'])->name('settings.logo');

        // Email Templates
        Route::get('/email-templates', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'index'])->name('email-templates');
        Route::post('/email-templates', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'store'])->name('email-templates.store');
        Route::put('/email-templates/{emailTemplate}', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'update'])->name('email-templates.update');
        Route::delete('/email-templates/{emailTemplate}', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'destroy'])->name('email-templates.destroy');
        Route::post('/email-templates/preview', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'preview'])->name('email-templates.preview');
    });

use App\Http\Controllers\Cashier\ScanController;
use App\Http\Controllers\Cashier\TransactionController;
use App\Http\Controllers\Cashier\RedeemController;

/*
|--------------------------------------------------------------------------
| Cashier Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'active', 'role:CASHIER,MANAGER'])
    ->prefix('cashier')
    ->name('cashier.')
    ->group(function () {
        Route::get('/dashboard', [CashierDashboardController::class, 'index'])->name('dashboard');
        Route::get('/scan', [ScanController::class, 'index'])->name('scan');
        Route::post('/transaction', [TransactionController::class, 'store'])->name('transaction.store');
        Route::get('/redeem', [RedeemController::class, 'index'])->name('redeem');
        Route::post('/redeem', [RedeemController::class, 'store'])->name('redeem.store');
        Route::get('/history', [\App\Http\Controllers\Cashier\HistoryController::class, 'index'])->name('history');
        
        // Notifications
        Route::get('/notifications', [\App\Http\Controllers\Cashier\NotificationController::class, 'index'])->name('notifications');
        Route::post('/notifications/{id}/read', [\App\Http\Controllers\Cashier\NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('/notifications/mark-all-read', [\App\Http\Controllers\Cashier\NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
    });

/*
|--------------------------------------------------------------------------
| Fallback Dashboard (for any authenticated user)
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    $user = auth()->user();
    return match ($user->role) {
        'SUPER_ADMIN', 'ADMIN' => redirect()->route('admin.dashboard'),
        'MANAGER', 'CASHIER' => redirect()->route('cashier.dashboard'),
        'CUSTOMER' => redirect()->route('customer.dashboard'),
        default => Inertia::render('Dashboard'),
    };
})->middleware(['auth', 'active'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Profile Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'active'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| API Routes (for AJAX calls)
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Api\LookupController;

Route::middleware(['auth'])->prefix('api')->group(function () {
    Route::get('/customer/lookup', [LookupController::class, 'customerByMemberId']);
    Route::get('/voucher/lookup', [LookupController::class, 'voucherByCode']);
    Route::get('/admin/reports', [AdminReportController::class, 'getData']);
});

require __DIR__.'/auth.php';
