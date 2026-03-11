<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Categorie;
use App\Models\Produit;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Créer les Catégories
        $analgesique = Categorie::create(['nom' => 'Analgésiques', 'description' => 'Contre la douleur']);
        $antibio = Categorie::create(['nom' => 'Antibiotiques', 'description' => 'Contre les infections']);
        $sirop = Categorie::create(['nom' => 'Sirops', 'description' => 'Voies respiratoires']);

        // 2. Créer quelques Produits
        Produit::create([
            'nom' => 'Doliprane 1000mg',
            'description' => 'Paracétamol boîte de 8',
            'prix' => 2.50,
            'quantite_totale' => 150,
            'seuil_alerte' => 20,
            'code_barre' => '3400935561023',
            'categorie_id' => $analgesique->id,
        ]);

        Produit::create([
            'nom' => 'Amoxicilline 500mg',
            'description' => 'Sandoz - 12 gélules',
            'prix' => 5.80,
            'quantite_totale' => 8, // Bas : va déclencher une alerte
            'seuil_alerte' => 15,
            'code_barre' => '3400935812941',
            'categorie_id' => $antibio->id,
        ]);

        Produit::create([
            'nom' => 'Spasfon Lyoc',
            'description' => 'Boîte de 10',
            'prix' => 3.20,
            'quantite_totale' => 45,
            'seuil_alerte' => 10,
            'code_barre' => '3400936082405',
            'categorie_id' => $analgesique->id,
        ]);

        Produit::create([
            'nom' => 'Maxilase Sirop',
            'description' => 'Flacon de 200ml',
            'prix' => 6.15,
            'quantite_totale' => 0, // Rupture !
            'seuil_alerte' => 5,
            'code_barre' => '3400930103440',
            'categorie_id' => $sirop->id,
        ]);
    }
}