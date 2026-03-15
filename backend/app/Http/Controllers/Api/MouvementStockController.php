<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MouvementStock;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MouvementStockController extends Controller
{
    public function store(Request $request)
    {
        // Validation des données entrantes
        $validated = $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'type'       => 'required|in:ENTREE,SORTIE',
            'quantite'   => 'required|integer|min:1',
            'motif'      => 'required|string|max:255',
        ]);

        try {
            // Utilisation d'une transaction SQL (Sécurité SF2)
            return DB::transaction(function () use ($validated) {
                $produit = Produit::findOrFail($validated['produit_id']);

                // Calcul du nouveau stock
                if ($validated['type'] === 'ENTREE') {
                    $produit->quantite_totale += $validated['quantite'];
                } else {
                    // Vérifier si le stock est suffisant pour une sortie
                    if ($produit->quantite_totale < $validated['quantite']) {
                        throw new \Exception("Stock insuffisant pour retirer " . $validated['quantite'] . " unités.");
                    }
                    $produit->quantite_totale -= $validated['quantite'];
                }

                // Sauvegarde de la nouvelle quantité du produit
                $produit->save();

                // Création de l'historique du mouvement
                $mouvement = MouvementStock::create([
                    'produit_id' => $validated['produit_id'],
                    'type'       => $validated['type'],
                    'quantite'   => $validated['quantite'],
                    'motif'      => $validated['motif'],
                    'date'       => now(),
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Stock mis à jour avec succès',
                    'data' => [
                        'nouveau_stock' => $produit->quantite_totale,
                        'mouvement' => $mouvement
                    ]
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }
}