<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->integer('current_stamps')->default(0);
            $table->integer('total_stamps_earned')->default(0);
            $table->integer('total_stamps_used')->default(0);
            $table->timestamp('member_since')->useCurrent();
            $table->timestamp('last_transaction_at')->nullable();
            $table->integer('last_birthday_gift_year')->nullable();
            $table->boolean('qr_login_waiting')->default(false);
            $table->boolean('qr_login_approved')->default(false);
            $table->timestamp('qr_login_waiting_expiry')->nullable();
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
