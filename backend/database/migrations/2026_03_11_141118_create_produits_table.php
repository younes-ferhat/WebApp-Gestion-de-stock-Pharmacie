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
    Schema::create('produits', function (Blueprint $table) {
        $table->id();
        $table->string('nom');
        $table->text('description')->nullable();
        $table->decimal('prix', 8, 2);
        $table->integer('quantite_totale')->default(0);
        $table->integer('seuil_alerte')->default(10);
        $table->string('code_barre')->nullable();
        
        // Clés étrangères
        $table->foreignId('categorie_id')->constrained('categories')->onDelete('cascade');
        $table->foreignId('fournisseur_id')->nullable()->constrained('fournisseurs')->onDelete('set null');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
