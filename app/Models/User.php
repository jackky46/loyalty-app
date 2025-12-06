<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected static function booted(): void
    {
        static::creating(function ($user) {
            // Generate unique member_id for all users
            if (empty($user->member_id)) {
                if ($user->role === 'CUSTOMER' || empty($user->role)) {
                    // Customer format: MXU-HCI-YYYY-XXXXX
                    $year = date('Y');
                    $prefix = "MXU-HCI-{$year}-";
                    
                    // Find last member_id with same prefix this year
                    $lastMember = User::where('member_id', 'like', $prefix . '%')
                        ->orderBy('member_id', 'desc')
                        ->first();
                    
                    if ($lastMember) {
                        // Extract last number and increment
                        $lastNumber = (int) substr($lastMember->member_id, -5);
                        $newNumber = $lastNumber + 1;
                    } else {
                        $newNumber = 1;
                    }
                    
                    $user->member_id = $prefix . str_pad($newNumber, 5, '0', STR_PAD_LEFT);
                } else {
                    // Staff format: PREFIX + random
                    $prefix = match($user->role) {
                        'ADMIN', 'SUPER_ADMIN' => 'ADM',
                        'MANAGER' => 'MGR',
                        'CASHIER' => 'CSH',
                        default => 'STF',
                    };
                    $user->member_id = $prefix . strtoupper(substr(uniqid(), -8));
                }
            }
            
            // Generate qr_code_data if empty
            if (empty($user->qr_code_data)) {
                $user->qr_code_data = json_encode([
                    'member_id' => $user->member_id,
                    'type' => $user->role ?? 'CUSTOMER',
                ]);
            }
        });
    }

    protected $fillable = [
        'role',
        'name',
        'email',
        'phone',
        'password',
        'member_id',
        'qr_code_data',
        'birth_date',
        'email_verified',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'email_verified' => 'boolean',
            'is_active' => 'boolean',
            'password' => 'hashed',
        ];
    }

    // Role checking helpers
    public function isCustomer(): bool
    {
        return $this->role === 'CUSTOMER';
    }

    public function isCashier(): bool
    {
        return $this->role === 'CASHIER';
    }

    public function isManager(): bool
    {
        return $this->role === 'MANAGER';
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['ADMIN', 'SUPER_ADMIN']);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'SUPER_ADMIN';
    }

    // Relationships
    public function customer(): HasOne
    {
        return $this->hasOne(Customer::class);
    }

    public function employee(): HasOne
    {
        return $this->hasOne(Employee::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function pushSubscriptions(): HasMany
    {
        return $this->hasMany(PushSubscription::class);
    }
}
