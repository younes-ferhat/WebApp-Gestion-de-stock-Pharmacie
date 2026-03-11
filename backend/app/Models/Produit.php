<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
   public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function lots()
    {
        return $this->hasMany(Lot::class);
    }

    public function mouvements()
    {
        return $this->hasMany(MouvementStock::class);
    }
}
