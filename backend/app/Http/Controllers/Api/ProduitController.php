<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    public function index()
    {
        $produits = Produit::with(['categorie', 'fournisseur', 'lots'])->latest()->get();

        return response()->json($produits);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'quantite_totale' => 'required|integer|min:0',
            'seuil_alerte' => 'required|integer|min:0',
            'code_barre' => 'nullable|string|max:255',
            'categorie_id' => 'required|exists:categories,id',
            'fournisseur_id' => 'nullable|exists:fournisseurs,id',
        ]);

        $produit = Produit::create($validated);

        return response()->json($produit->load(['categorie', 'fournisseur', 'lots']), 201);
    }

    public function show(Produit $produit)
    {
        return response()->json($produit->load(['categorie', 'fournisseur', 'lots']));
    }

    public function update(Request $request, Produit $produit)
    {
        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'sometimes|numeric|min:0',
            'quantite_totale' => 'sometimes|integer|min:0',
            'seuil_alerte' => 'sometimes|integer|min:0',
            'code_barre' => 'nullable|string|max:255',
            'categorie_id' => 'sometimes|exists:categories,id',
            'fournisseur_id' => 'nullable|exists:fournisseurs,id',
        ]);

        $produit->update($validated);

        return response()->json($produit->load(['categorie', 'fournisseur', 'lots']));
    }

    public function destroy(Produit $produit)
    {
        $produit->delete();

        return response()->json([
            'message' => 'Produit supprime avec succes',
        ]);
    }
}
