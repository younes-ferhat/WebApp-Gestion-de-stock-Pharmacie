<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lot;
use App\Models\Produit;
use App\Models\MouvementStock; // <--- NE PAS OUBLIER CET IMPORT
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class LotController extends Controller
{
    public function index()
    {
        return response()->json(Lot::with('produit')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'numero_lot' => 'required|string|max:255',
            'quantite' => 'required|integer|min:1',
            'date_peremption' => 'required|date',
        ]);

        $lot = DB::transaction(function () use ($validated) {
            // 1. Création du lot
            $lot = Lot::create($validated);

            // 2. Mise à jour du stock total
            $produit = Produit::lockForUpdate()->findOrFail($validated['produit_id']);
            $produit->increment('quantite_totale', $validated['quantite']);

            // 3. CRÉATION DU MOUVEMENT (Pour l'historique)
            MouvementStock::create([
                'produit_id' => $validated['produit_id'],
                'type' => 'ENTREE',
                'quantite' => $validated['quantite'],
                'motif' => "Réception Lot n°" . $validated['numero_lot'],
                'date' => now(),
                'utilisateur_id' => Auth::id(), // C'est ici qu'on remplit la colonne "Auteur"
            ]);

            return $lot;
        });

        return response()->json($lot->load('produit'), 201);
    }

    // ... (Show et Update restent identiques ou peuvent être améliorés de la même façon)

    public function destroy(Lot $lot)
    {
        DB::transaction(function () use ($lot) {
            $produit = Produit::lockForUpdate()->findOrFail($lot->produit_id);
            $produit->decrement('quantite_totale', $lot->quantite);

            // OPTIONNEL : Tracer aussi la suppression dans l'historique
            MouvementStock::create([
                'produit_id' => $lot->produit_id,
                'type' => 'SORTIE',
                'quantite' => $lot->quantite,
                'motif' => "Suppression/Retrait du Lot n°" . $lot->numero_lot,
                'date' => now(),
                'utilisateur_id' => Auth::id(),
            ]);

            $lot->delete();
        });

        return response()->json(['message' => 'Lot supprimé et stock mis à jour']);
    }
}