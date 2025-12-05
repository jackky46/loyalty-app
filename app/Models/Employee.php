<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    protected static function booted(): void
    {
        static::creating(function ($employee) {
            if (empty($employee->employee_code)) {
                $employee->employee_code = 'EMP' . strtoupper(substr(uniqid(), -8));
            }
        });
    }

    protected $fillable = [
        'user_id',
        'employee_code',
        'location_id',
        'position',
        'hire_date',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'hire_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function processedTransactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'cashier_id');
    }

    public function processedRedemptions(): HasMany
    {
        return $this->hasMany(Redemption::class, 'cashier_id');
    }
}
