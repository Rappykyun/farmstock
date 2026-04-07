<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('address')->nullable()->after('email');
            $table->string('contact_number')->nullable()->after('address');
            $table->string('farm_name')->nullable()->after('contact_number');
            $table->text('farm_details')->nullable()->after('farm_name');
            $table->string('avatar')->nullable()->after('farm_details');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'address',
                'contact_number',
                'farm_name',
                'farm_details',
                'avatar',
            ]);
        });
    }
};
