<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('qr_login_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->unique();
            $table->text('qr_data');
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('approved')->default(false);
            $table->timestamp('expires_at');
            $table->timestamps();

            $table->index('session_id');
            $table->index('customer_id');
            $table->index('approved');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('qr_login_sessions');
    }
};
