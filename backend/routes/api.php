<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CategorieController; 
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MouvementStockController;

// --- ROUTES PUBLIQUES ---
// On ajoute ->name('login') pour éviter l'erreur Route [login] not defined
Route::post('/auth/login', [AuthController::class, 'login'])->name('login');
Route::post('/mouvements', [MouvementStockController::class, 'store']);

// --- ROUTES PROTÉGÉES ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Produits & Catégories (Automatiquement protégés par Sanctum)
    Route::apiResource('categories', CategorieController::class);
    Route::apiResource('produits', ProduitController::class);
    Route::middleware('auth:sanctum')->group(function () {
    // ... tes routes produits ...

    // Nouvelles routes pour les utilisateurs
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});
    
    // Exemple de protection par rôle (Issue ADMIN)
    // Route::delete('/produits/{id}', [ProduitController::class, 'destroy'])->middleware('role:ADMIN');
});