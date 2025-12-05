<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_blocks', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('category'); // home, voucher, qr, profile
            $table->string('title')->nullable();
            $table->text('content'); // Rich text HTML
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('category');
            $table->index('key');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_blocks');
    }
};
