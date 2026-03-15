<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produit extends Model
{
    protected $fillable = [
        'nom', 'description', 'prix', 'quantite_totale', 
        'seuil_alerte', 'code_barre', 'categorie_id', 'fournisseur_id'
    ];

    // --- RELATIONS "BELONGS TO" (Le produit appartient à...) ---

   public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class);
    }

    // --- RELATIONS "HAS MANY" (Le produit possède plusieurs...) ---

    public function lots(): HasMany
    {
        return $this->hasMany(Lot::class);
    }

    public function mouvementsStock(): HasMany
    {
        return $this->hasMany(MouvementStock::class);
    }
} // <--- On ne ferme la classe qu'ICI !