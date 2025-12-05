<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auto_gift_rules', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Birthday Gift, First Transaction Bonus
            $table->text('description')->nullable();
            $table->string('trigger_type'); // BIRTHDAY, TRANSACTION_COUNT, STAMP_MILESTONE, PROFILE_COMPLETE, REGISTRATION
            $table->text('trigger_value')->nullable(); // JSON
            $table->string('reward_type'); // STAMP, VOUCHER, BOTH
            $table->integer('reward_stamps')->nullable();
            $table->integer('reward_voucher_tier')->nullable(); // 1 (5 stamps) or 2 (10 stamps)
            $table->boolean('is_active')->default(true);
            $table->integer('priority')->default(0);
            $table->timestamps();

            $table->index('trigger_type');
            $table->index('is_active');
        });

        Schema::create('auto_gift_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rule_id')->constrained('auto_gift_rules')->onDelete('cascade');
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->text('trigger_data')->nullable(); // JSON
            $table->text('reward_given'); // JSON
            $table->timestamp('gifted_at')->useCurrent();

            $table->index('rule_id');
            $table->index('customer_id');
            $table->index('gifted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auto_gift_history');
        Schema::dropIfExists('auto_gift_rules');
    }
};
