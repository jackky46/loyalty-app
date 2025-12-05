<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrandingSetting extends Model
{
    protected $table = 'branding_settings';

    protected $fillable = [
        'logo_image',
        'brand_name',
        'card_title',
    ];

    // Get current branding (singleton pattern)
    public static function current(): self
    {
        return static::first() ?? new self([
            'brand_name' => 'MIXUE',
            'card_title' => 'MEMBER CARD',
            'logo_image' => '',
        ]);
    }
}
