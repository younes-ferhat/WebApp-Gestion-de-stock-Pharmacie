<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// On importe ton contrôleur
use App\Http\Controllers\ProduitController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// La route pour l'utilisateur (on la laisse, ça ne mange pas de pain)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// LA ROUTE MAGIQUE POUR TES PRODUITS
// Elle crée automatiquement GET /api/produits, POST, etc.
Route::apiResource('produits', ProduitController::class);