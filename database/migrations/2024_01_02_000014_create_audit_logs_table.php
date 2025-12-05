<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->enum('user_role', ['CUSTOMER', 'CASHIER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN']);
            $table->string('action'); // CREATE, UPDATE, DELETE, LOGIN
            $table->string('resource'); // Employee, Product, Location
            $table->unsignedBigInteger('resource_id')->nullable();
            $table->text('details')->nullable(); // JSON
            $table->string('ip_address')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('user_id');
            $table->index('action');
            $table->index('resource');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
