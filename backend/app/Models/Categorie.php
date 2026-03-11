<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    public function produits()
    {
        return $this->hasMany(Produit::class);
    }
}
