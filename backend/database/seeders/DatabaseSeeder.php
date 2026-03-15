<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Categorie;
use App\Models\Produit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Utilisateur
        User::updateOrCreate(
            ['email' => 'admin@pharmacie.local'],
            [
                'name' => 'Administrateur',
                'password' => Hash::make('password123'),
                'role' => 'ADMIN'
            ]
        );
        User::updateOrCreate(
        ['email' => 'employe1@pharmacie.local'], // <--- L'email de ton image
        [
            'name' => 'Vendeur Pharmacie',
            'password' => Hash::make('password123'),
            'role' => 'EMPLOYE' // Son rôle par défaut
        ]
    );
        // 2. Catégories (On utilise updateOrCreate pour éviter les erreurs de doublons)
        $analgesique = Categorie::updateOrCreate(['nom' => 'Analgésiques'], ['description' => 'Contre la douleur']);
        $antibio     = Categorie::updateOrCreate(['nom' => 'Antibiotiques'], ['description' => 'Contre les infections']);
        $sirop       = Categorie::updateOrCreate(['nom' => 'Sirops'], ['description' => 'Voies respiratoires']);
        
        Categorie::updateOrCreate(['nom' => 'Vitamines']);
        Categorie::updateOrCreate(['nom' => 'Matériel Médical']);

        // 3. Produits (On utilise updateOrCreate sur le nom ou le code barre)
        Produit::updateOrCreate(
            ['nom' => 'Doliprane 1000mg'],
            [
                'description' => 'Paracétamol boîte de 8',
                'prix' => 2.50,
                'quantite_totale' => 150,
                'seuil_alerte' => 20,
                'code_barre' => '3400935561023',
                'categorie_id' => $analgesique->id,
            ]
        );

        Produit::updateOrCreate(
            ['nom' => 'Amoxicilline 500mg'],
            [
                'description' => 'Sandoz - 12 gélules',
                'prix' => 5.80,
                'quantite_totale' => 8,
                'seuil_alerte' => 15,
                'code_barre' => '3400935812941',
                'categorie_id' => $antibio->id,
            ]
        );

        Produit::updateOrCreate(
            ['nom' => 'Maxilase Sirop'],
            [
                'description' => 'Flacon de 200ml',
                'prix' => 6.15,
                'quantite_totale' => 0,
                'seuil_alerte' => 5,
                'code_barre' => '3400930103440',
                'categorie_id' => $sirop->id,
            ]
        );

        $this->command->info('Base de données initialisée avec succès (Utilisateurs, Catégories et Produits) !');
    }
}