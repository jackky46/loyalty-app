<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('redemptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('voucher_id')->unique()->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained();
            $table->unsignedBigInteger('cashier_id')->nullable();
            $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('redeemed_at')->useCurrent();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('cashier_id')->references('id')->on('employees')->nullOnDelete();

            $table->index('customer_id');
            $table->index('voucher_id');
            $table->index('product_id');
            $table->index('redeemed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('redemptions');
    }
};
