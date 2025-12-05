<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PopupView extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'popup_id',
        'user_id',
        'viewed_at',
    ];

    protected function casts(): array
    {
        return [
            'viewed_at' => 'datetime',
        ];
    }

    public function popup(): BelongsTo
    {
        return $this->belongsTo(Popup::class);
    }
}
