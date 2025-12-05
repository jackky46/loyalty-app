<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AutoGiftHistory extends Model
{
    public $timestamps = false;

    protected $table = 'auto_gift_history';

    protected $fillable = [
        'rule_id',
        'customer_id',
        'trigger_data',
        'reward_given',
        'gifted_at',
    ];

    protected function casts(): array
    {
        return [
            'trigger_data' => 'array',
            'reward_given' => 'array',
            'gifted_at' => 'datetime',
        ];
    }

    public function rule(): BelongsTo
    {
        return $this->belongsTo(AutoGiftRule::class, 'rule_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
