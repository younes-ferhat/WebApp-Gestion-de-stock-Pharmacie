<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lot extends Model
{
    // On ajoute les champs autorisés
    protected $fillable = [
        'produit_id', 
        'numero_lot', 
        'quantite', 
        'date_peremption'
    ];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }
}