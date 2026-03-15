<?php

namespace Tests\Feature;

use App\Models\Categorie;
use App\Models\Fournisseur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProduitApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_produit_est_sauvegarde_en_base_de_donnees(): void
    {
        $categorie = Categorie::create([
            'nom' => 'Antalgiques',
            'description' => 'Medicaments contre la douleur',
        ]);

        $fournisseur = Fournisseur::create([
            'nom' => 'Pharma Plus',
            'email' => 'contact@pharmaplus.test',
            'telephone' => '770000000',
        ]);

        $payload = [
            'nom' => 'Paracetamol 500mg',
            'description' => 'Comprime',
            'prix' => 1500,
            'quantite_totale' => 100,
            'seuil_alerte' => 20,
            'code_barre' => '1234567890123',
            'categorie_id' => $categorie->id,
            'fournisseur_id' => $fournisseur->id,
        ];

        $response = $this->postJson('/api/produits', $payload);

        $response
            ->assertCreated()
            ->assertJsonPath('nom', 'Paracetamol 500mg')
            ->assertJsonPath('seuil_alerte', 20)
            ->assertJsonPath('quantite_totale', 100);

        $this->assertDatabaseHas('produits', [
            'nom' => 'Paracetamol 500mg',
            'seuil_alerte' => 20,
            'quantite_totale' => 100,
            'categorie_id' => $categorie->id,
            'fournisseur_id' => $fournisseur->id,
        ]);
    }
}
