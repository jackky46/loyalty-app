<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'user_role',
        'action',
        'resource',
        'resource_id',
        'details',
        'ip_address',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'details' => 'array',
            'created_at' => 'datetime',
        ];
    }

    // Helper to log an action
    public static function log(
        int $userId,
        string $userRole,
        string $action,
        string $resource,
        ?int $resourceId = null,
        ?array $details = null,
        ?string $ipAddress = null
    ): self {
        return static::create([
            'user_id' => $userId,
            'user_role' => $userRole,
            'action' => $action,
            'resource' => $resource,
            'resource_id' => $resourceId,
            'details' => $details,
            'ip_address' => $ipAddress,
            'created_at' => now(),
        ]);
    }
}
