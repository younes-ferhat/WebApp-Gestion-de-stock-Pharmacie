<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MouvementStock;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth; // Import ajouté pour l'authentification

class MouvementStockController extends Controller
{
    /**
     * Affiche la liste des mouvements (L'HISTORIQUE)
     */
    public function index()
    {
        // On récupère les mouvements avec les infos du produit ET de l'utilisateur
        $mouvements = MouvementStock::with(['produit', 'utilisateur'])->orderBy('created_at', 'desc')->get();
        
        return response()->json($mouvements);
    }

    /**
     * Enregistre un nouveau mouvement (ENTREE/SORTIE)
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
                $produit = Produit::findOrFail($validated['produit_id']);

                if ($validated['type'] === 'ENTREE') {
                    $produit->quantite_totale += $validated['quantite'];
                } else {
                    if ($produit->quantite_totale < $validated['quantite']) {
                        throw new \Exception("Stock insuffisant pour retirer " . $validated['quantite'] . " unités.");
                    }
                    $produit->quantite_totale -= $validated['quantite'];
                }

                $produit->save();

                // On crée le mouvement avec l'ID de l'utilisateur qui fait l'action
                $mouvement = MouvementStock::create([
                    'produit_id'     => $validated['produit_id'],
                    'utilisateur_id' => Auth::id() ?? 1, // On prend l'ID de l'user connecté, sinon l'admin (ID 1)
                    'type'           => $validated['type'],
                    'quantite'       => $validated['quantite'],
                    'motif'          => $validated['motif'],
                    'date'           => now(),
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Stock mis à jour avec succès',
                    'data' => [
                        'nouveau_stock' => $produit->quantite_totale,
                        'mouvement' => $mouvement->load('utilisateur') // On renvoie l'info de l'user
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