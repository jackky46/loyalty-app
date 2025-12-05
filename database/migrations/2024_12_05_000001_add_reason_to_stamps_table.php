<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stamps', function (Blueprint $table) {
            // Add reason column for tracking stamp source (transaction, birthday reward, bonus, etc)
            $table->string('reason')->default('TRANSACTION')->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('stamps', function (Blueprint $table) {
            $table->dropColumn('reason');
        });
    }
};
