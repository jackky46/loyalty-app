<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Voucher extends Model
{
    protected $fillable = [
        'customer_id',
        'code',
        'stamps_used',
        'status',
        'qr_code_data',
        'expires_at',
        'used_at',
    ];

    protected function casts(): array
    {
        return [
            'stamps_used' => 'integer',
            'expires_at' => 'datetime',
            'used_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function redemption(): HasOne
    {
        return $this->hasOne(Redemption::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function scopeUsed($query)
    {
        return $query->where('status', 'USED');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'EXPIRED');
    }

    public function isActive(): bool
    {
        return $this->status === 'ACTIVE' && $this->expires_at->isFuture();
    }
}
