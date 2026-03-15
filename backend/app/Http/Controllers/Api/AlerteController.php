<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Lot;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class AlerteController extends Controller
{
    public function index(): JsonResponse
    {
        // 1. Produits sous le seuil d'alerte (quantite_totale < seuil_alerte)
        $alertesStock = Produit::whereColumn('quantite_totale', '<', 'seuil_alerte')
            ->with('categorie')
            ->get();

        // 2. Lots dont la péremption est proche (< 30 jours)
        $trenteJours = Carbon::now()->addDays(30);
        $alertesPeremption = Lot::where('date_peremption', '<=', $trenteJours)
            ->with('produit')
            ->orderBy('date_peremption', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'donnees' => [
                'produits_en_rupture_proche' => $alertesStock,
                'lots_expirant_bientot' => $alertesPeremption
            ],
            'stats' => [
                'total_alertes_stock' => $alertesStock->count(),
                'total_alertes_peremption' => $alertesPeremption->count()
            ]
        ]);
    }
}