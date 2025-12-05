<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('cashier_id')->nullable();
            $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('total_amount', 10, 2);
            $table->integer('stamps_earned')->default(1);
            $table->string('entry_method')->default('QR_SCAN'); // QR_SCAN or MANUAL_CODE
            $table->timestamp('transaction_date')->useCurrent();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('cashier_id')->references('id')->on('employees')->nullOnDelete();

            $table->index('customer_id');
            $table->index('cashier_id');
            $table->index('location_id');
            $table->index('transaction_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
