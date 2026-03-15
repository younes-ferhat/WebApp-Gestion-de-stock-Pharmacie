<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lot;
use App\Models\Produit;
use Illuminate\Support\Facades\DB;

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
            $lot = Lot::create($validated);

            $produit = Produit::lockForUpdate()->findOrFail($validated['produit_id']);
            $produit->increment('quantite_totale', $validated['quantite']);

            return $lot;
        });

        return response()->json($lot->load('produit'), 201);
    }

    public function show(Lot $lot)
    {
        return response()->json($lot->load('produit'));
    }

    public function update(Request $request, Lot $lot)
    {
        $validated = $request->validate([
            'produit_id' => 'sometimes|exists:produits,id',
            'numero_lot' => 'sometimes|string|max:255',
            'quantite' => 'sometimes|integer|min:1',
            'date_peremption' => 'sometimes|date',
        ]);

        $lot = DB::transaction(function () use ($lot, $validated) {
            $ancienProduitId = $lot->produit_id;
            $ancienneQuantite = $lot->quantite;

            $nouveauProduitId = $validated['produit_id'] ?? $ancienProduitId;
            $nouvelleQuantite = $validated['quantite'] ?? $ancienneQuantite;

            $lot->update($validated);

            if ($ancienProduitId === $nouveauProduitId) {
                $delta = $nouvelleQuantite - $ancienneQuantite;
                if ($delta !== 0) {
                    $produit = Produit::lockForUpdate()->findOrFail($ancienProduitId);
                    $produit->increment('quantite_totale', $delta);
                }
            } else {
                $ancienProduit = Produit::lockForUpdate()->findOrFail($ancienProduitId);
                $ancienProduit->decrement('quantite_totale', $ancienneQuantite);

                $nouveauProduit = Produit::lockForUpdate()->findOrFail($nouveauProduitId);
                $nouveauProduit->increment('quantite_totale', $nouvelleQuantite);
            }

            return $lot;
        });

        return response()->json($lot->load('produit'));
    }

    public function destroy(Lot $lot)
    {
        DB::transaction(function () use ($lot) {
            $produit = Produit::lockForUpdate()->findOrFail($lot->produit_id);
            $produit->decrement('quantite_totale', $lot->quantite);

            $lot->delete();
        });

        return response()->json([
            'message' => 'Lot supprimé avec succès'
        ]);
    }
}