<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    /**
     * Retourne toutes les catégories pour les menus déroulants
     */
    public function index()
    {
        $categories = Categorie::all();
        return response()->json($categories);
    }

    // Tu peux laisser les autres méthodes (store, show, etc.) vides pour l'instant
}