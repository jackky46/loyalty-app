<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('popups', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content'); // HTML content
            $table->string('image_url')->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->string('target_role')->nullable(); // ALL, CUSTOMER, CASHIER
            $table->string('frequency')->default('ONCE'); // ONCE, DAILY, ALWAYS
            $table->string('action_label')->nullable();
            $table->string('action_url')->nullable();
            $table->integer('priority')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('is_active');
            $table->index('start_date');
            $table->index('end_date');
            $table->index('priority');
        });

        Schema::create('popup_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('popup_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('user_id');
            $table->timestamp('viewed_at')->useCurrent();

            $table->index('popup_id');
            $table->index('user_id');
            $table->index('viewed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('popup_views');
        Schema::dropIfExists('popups');
    }
};
