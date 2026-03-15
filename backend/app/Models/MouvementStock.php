<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MouvementStock extends Model
{
    // Ajoute ceci pour autoriser l'enregistrement de ces colonnes
    protected $fillable = [
        'produit_id', 
        'type',      // 'ENTREE' ou 'SORTIE'
        'quantite', 
        'motif', 
        'date'
    ];

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}