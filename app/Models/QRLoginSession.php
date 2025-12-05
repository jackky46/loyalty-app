<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QRLoginSession extends Model
{
    protected $table = 'qr_login_sessions';

    protected $fillable = [
        'session_id',
        'qr_data',
        'customer_id',
        'approved',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'approved' => 'boolean',
            'expires_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function scopePending($query)
    {
        return $query->where('approved', false)
            ->where('expires_at', '>', now());
    }
}
