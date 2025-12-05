<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AutoGiftRule extends Model
{
    protected $fillable = [
        'name',
        'description',
        'trigger_type',
        'trigger_value',
        'reward_type',
        'reward_stamps',
        'reward_voucher_tier',
        'is_active',
        'priority',
    ];

    protected function casts(): array
    {
        return [
            'trigger_value' => 'array',
            'reward_stamps' => 'integer',
            'reward_voucher_tier' => 'integer',
            'is_active' => 'boolean',
            'priority' => 'integer',
        ];
    }

    public function history(): HasMany
    {
        return $this->hasMany(AutoGiftHistory::class, 'rule_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('priority', 'desc');
    }

    public function scopeTriggerType($query, string $type)
    {
        return $query->where('trigger_type', $type);
    }
}
