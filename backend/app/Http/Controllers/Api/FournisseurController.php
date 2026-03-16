<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fournisseur;
use Illuminate\Http\Request;

class FournisseurController extends Controller
{
    // Lister tous les fournisseurs
    public function index()
    {
        return response()->json(Fournisseur::all());
    }

    // Créer un fournisseur
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telephone' => 'nullable|string|max:20',
        ]);

        $fournisseur = Fournisseur::create($validated);

        return response()->json($fournisseur, 201);
    }

    // Voir un fournisseur spécifique
    public function show(Fournisseur $fournisseur)
    {
        return response()->json($fournisseur);
    }

    // Modifier un fournisseur
    public function update(Request $request, Fournisseur $fournisseur)
    {
        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telephone' => 'nullable|string|max:20',
        ]);

        $fournisseur->update($validated);

        return response()->json($fournisseur);
    }

    // Supprimer un fournisseur
    public function destroy(Fournisseur $fournisseur)
    {
        $fournisseur->delete();
        return response()->json(['message' => 'Fournisseur supprimé avec succès']);
    }
}