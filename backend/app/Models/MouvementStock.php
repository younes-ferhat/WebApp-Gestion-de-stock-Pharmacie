<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MouvementStock extends Model
{
    public function produit()
{
    return $this->belongsTo(Produit::class);
}
}
