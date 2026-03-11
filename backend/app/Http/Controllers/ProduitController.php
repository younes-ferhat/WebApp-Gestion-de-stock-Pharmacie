<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProduitController extends Controller
{
    /**
     * GET /api/produits : Liste tous les produits avec leurs catégories
     */
    public function index()
    {
        // On récupère les produits avec leur catégorie et leur fournisseur
        $produits = Produit::with(['categorie', 'fournisseur'])->get();
        return response()->json($produits);
    }

    /**
     * POST /api/produits : Ajouter un nouveau médicament
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prix' => 'required|numeric',
            'quantite_totale' => 'required|integer',
            'categorie_id' => 'required|exists:categories,id',
            'seuil_alerte' => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $produit = Produit::create($request->all());
        return response()->json($produit, 201);
    }

    /**
     * GET /api/produits/{id} : Voir les détails d'un seul produit
     */
    public function show(Produit $produit)
    {
        return response()->json($produit->load(['categorie', 'fournisseur', 'lots']));
    }

    /**
     * PUT/PATCH /api/produits/{id} : Modifier un produit
     */
    public function update(Request $request, Produit $produit)
    {
        $produit->update($request->all());
        return response()->json($produit);
    }

    /**
     * DELETE /api/produits/{id} : Supprimer un produit
     */
    public function destroy(Produit $produit)
    {
        $produit->delete();
        return response()->json(['message' => 'Produit supprimé avec succès']);
    }
}