<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->string('code')->unique(); // MV-A3F9K2
            $table->integer('stamps_used'); // 5 or 10
            $table->enum('status', ['ACTIVE', 'USED', 'EXPIRED'])->default('ACTIVE');
            $table->text('qr_code_data'); // JSON for voucher QR
            $table->timestamp('expires_at');
            $table->timestamp('used_at')->nullable();
            $table->timestamps();

            $table->index('customer_id');
            $table->index('code');
            $table->index('status');
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
