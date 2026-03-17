<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Categorie;
use App\Models\Produit;
use App\Models\Lot;
use App\Models\Fournisseur; // Ajout du modèle Fournisseur
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. UTILISATEURS
        User::updateOrCreate(
            ['email' => 'admin@pharmacie.local'],
            [
                'name' => 'Administrateur',
                'password' => Hash::make('password123'),
                'role' => 'ADMIN'
            ]
        );

        User::updateOrCreate(
            ['email' => 'employe1@pharmacie.local'],
            [
                'name' => 'Vendeur Pharmacie',
                'password' => Hash::make('password123'),
                'role' => 'EMPLOYE'
            ]
        );

        // 2. FOURNISSEURS (Le code de Younes intégré ici)
        $sanofi = Fournisseur::updateOrCreate(
            ['email' => 'contact@sanofi.fr'],
            ['nom' => 'Sanofi Aventis', 'telephone' => '0144777777']
        );

        $biogaran = Fournisseur::updateOrCreate(
            ['email' => 'info@biogaran.fr'],
            ['nom' => 'Biogaran Laboratoires', 'telephone' => '0155667788']
        );

        // 3. CATÉGORIES
        $analgesique = Categorie::updateOrCreate(['nom' => 'Analgésiques'], ['description' => 'Contre la douleur']);
        $antibio     = Categorie::updateOrCreate(['nom' => 'Antibiotiques'], ['description' => 'Contre les infections']);
        $sirop       = Categorie::updateOrCreate(['nom' => 'Sirops'], ['description' => 'Voies respiratoires']);
        
        Categorie::updateOrCreate(['nom' => 'Vitamines']);
        Categorie::updateOrCreate(['nom' => 'Matériel Médical']);

        // 4. PRODUITS (Liaison aux fournisseurs ajoutée)
        $doliprane = Produit::updateOrCreate(
            ['nom' => 'Doliprane 1000mg'],
            [
                'description' => 'Paracétamol boîte de 8',
                'prix' => 2.50,
                'quantite_totale' => 150,
                'seuil_alerte' => 20,
                'code_barre' => '3400935561023',
                'categorie_id' => $analgesique->id,
                'fournisseur_id' => $sanofi->id, // On lie à Sanofi !
            ]
        );

        $amoxicilline = Produit::updateOrCreate(
            ['nom' => 'Amoxicilline 500mg'],
            [
                'description' => 'Sandoz - 12 gélules',
                'prix' => 5.80,
                'quantite_totale' => 8,
                'seuil_alerte' => 15,
                'code_barre' => '3400935812941',
                'categorie_id' => $antibio->id,
                'fournisseur_id' => $biogaran->id, // On lie à Biogaran !
            ]
        );

        $maxilase = Produit::updateOrCreate(
            ['nom' => 'Maxilase Sirop'],
            [
                'description' => 'Flacon de 200ml',
                'prix' => 6.15,
                'quantite_totale' => 0,
                'seuil_alerte' => 5,
                'code_barre' => '3400930103440',
                'categorie_id' => $sirop->id,
                'fournisseur_id' => $sanofi->id,
            ]
        );

        // 5. LOTS
        Lot::updateOrCreate(
            ['numero_lot' => 'LOT-2026-DOLI'],
            [
                'date_peremption' => '2026-12-31',
                'quantite' => 150,
                'produit_id' => $doliprane->id,
            ]
        );

        Lot::updateOrCreate(
            ['numero_lot' => 'LOT-2026-AMOX'],
            [
                'date_peremption' => '2026-03-20',
                'quantite' => 8,
                'produit_id' => $amoxicilline->id,
            ]
        );

        $this->command->info('Base de données initialisée avec fournisseurs et liaisons IA !');
    }
}