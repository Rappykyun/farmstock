<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consumer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('farmer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('status_id')->constrained('statuses')->restrictOnDelete();
            $table->text('notes')->nullable();
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->timestamps();

            $table->index(['consumer_id', 'created_at']);
            $table->index(['farmer_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_requests');
    }
};
