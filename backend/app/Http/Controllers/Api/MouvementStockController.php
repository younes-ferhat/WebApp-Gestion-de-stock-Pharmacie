<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MouvementStock;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth; // Ajouté pour l'utilisateur connecté


class MouvementStockController extends Controller
{
    /**
     * Affiche l'historique des mouvements (Pour la page Historique React)
     */
    public function index()
    {
        // On récupère les mouvements avec les relations 'produit' et 'utilisateur'
        // sans ça, le front ne peut pas afficher les noms !
        return response()->json(
            MouvementStock::with(['produit', 'utilisateur'])->latest()->get()
        );
    }

    /**
     * Enregistre un mouvement (Vente ou Ajout manuel)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'type'       => 'required|in:ENTREE,SORTIE',
            'quantite'   => 'required|integer|min:1',
            'motif'      => 'required|string|max:255',
        ]);

        try {
            return DB::transaction(function () use ($validated) {
                $produit = Produit::lockForUpdate()->findOrFail($validated['produit_id']);

                if ($validated['type'] === 'ENTREE') {
                    $produit->quantite_totale += $validated['quantite'];
                } else {
                    if ($produit->quantite_totale < $validated['quantite']) {
                        throw new \Exception("Stock insuffisant pour retirer " . $validated['quantite'] . " unités.");
                    }
                    $produit->quantite_totale -= $validated['quantite'];
                }

                $produit->save();

                // CORRECTION : On ajoute l'ID de l'utilisateur connecté (Auth::id())
                // pour que la colonne "Auteur" dans ton tableau React fonctionne.
                $mouvement = MouvementStock::create([
                    'produit_id'     => $validated['produit_id'],
                    'type'           => $validated['type'],
                    'quantite'       => $validated['quantite'],
                    'motif'          => $validated['motif'],
                    'date'           => now(),
                    'utilisateur_id' => Auth::id(), 
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Stock mis à jour avec succès',
                    'data' => [
                        'nouveau_stock' => $produit->quantite_totale,
                        'mouvement' => $mouvement->load(['produit', 'utilisateur'])
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