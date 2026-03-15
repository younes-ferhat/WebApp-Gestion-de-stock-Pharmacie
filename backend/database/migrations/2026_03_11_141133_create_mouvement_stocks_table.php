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
    Schema::create('mouvement_stocks', function (Blueprint $table) {
        $table->id();
        $table->enum('type', ['ENTREE', 'SORTIE']);
        $table->integer('quantite');
        $table->date('date');
        $table->string('motif')->nullable();
        
        // Clé étrangère vers Produit
        $table->foreignId('produit_id')->constrained('produits')->onDelete('cascade');
        // Clé étrangère vers l'utilisateur (Employé/Admin)
        $table->foreignId('utilisateur_id')->constrained('users');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mouvement_stocks');
    }
};
