<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CategorieController; 
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MouvementStockController;
use App\Http\Controllers\Api\AlerteController;

use function Symfony\Component\String\u;

use App\Http\Controllers\Api\LotController;
use App\Http\Controllers\Api\FournisseurController;

// --- ROUTES PUBLIQUES ---
// On ajoute ->name('login') pour éviter l'erreur Route [login] not defined
Route::post('/auth/login', [AuthController::class, 'login'])->name('login');
Route::post('/mouvements', [MouvementStockController::class, 'store']);
Route::get('alertes', [AlerteController::class, 'index']);


// --- ROUTES PROTÉGÉES ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Produits & Catégories (Automatiquement protégés par Sanctum)
    Route::apiResource('categories', CategorieController::class);
    Route::apiResource('produits', ProduitController::class);
     Route::apiResource('lots', LotController::class);
    
    Route::apiResource('fournisseurs', FournisseurController::class);
    // Nouvelles routes pour les utilisateurs
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
   
    
    // Exemple de protection par rôle (Issue ADMIN)
    // Route::delete('/produits/{id}', [ProduitController::class, 'destroy'])->middleware('role:ADMIN');
});