<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $fillable = [
        'user_id',
        'current_stamps',
        'total_stamps_earned',
        'total_stamps_used',
        'member_since',
        'last_transaction_at',
        'last_birthday_gift_year',
        'qr_login_waiting',
        'qr_login_approved',
        'qr_login_waiting_expiry',
    ];

    protected function casts(): array
    {
        return [
            'member_since' => 'datetime',
            'last_transaction_at' => 'datetime',
            'qr_login_waiting' => 'boolean',
            'qr_login_approved' => 'boolean',
            'qr_login_waiting_expiry' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function stamps(): HasMany
    {
        return $this->hasMany(Stamp::class);
    }

    public function vouchers(): HasMany
    {
        return $this->hasMany(Voucher::class);
    }

    public function redemptions(): HasMany
    {
        return $this->hasMany(Redemption::class);
    }

    public function qrLoginSessions(): HasMany
    {
        return $this->hasMany(QRLoginSession::class);
    }

    public function autoGiftHistory(): HasMany
    {
        return $this->hasMany(AutoGiftHistory::class);
    }
}
