
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CategorieController; 
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MouvementStockController;
use App\Http\Controllers\Api\AlerteController;
use App\Http\Controllers\Api\AssistantController;
use App\Http\Controllers\Api\LotController;
use App\Http\Controllers\Api\FournisseurController;

// --- 1. ROUTES PUBLIQUES (Accessibles sans connexion) ---
Route::post('/auth/login', [AuthController::class, 'login'])->name('login');

// Routes débloquées pour corriger les erreurs 401/405 de tes collègues
Route::get('/mouvements', [MouvementStockController::class, 'index']); // Pour l'historique
Route::post('/mouvements', [MouvementStockController::class, 'store']); // Pour enregistrer
Route::get('/alertes', [AlerteController::class, 'index']);            // Pour le dashboard
Route::post('/assistant', [AssistantController::class, 'ask']);      // Pour ton IA

// --- 2. ROUTES PROTÉGÉES (Nécessitent un Token Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth & Profil
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Ressources CRUD (Automatiquement protégés)
    Route::apiResource('categories', CategorieController::class);
    Route::apiResource('produits', ProduitController::class);
    Route::apiResource('lots', LotController::class);
    Route::apiResource('fournisseurs', FournisseurController::class);
    
    // Gestion des utilisateurs (Admin)
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
});