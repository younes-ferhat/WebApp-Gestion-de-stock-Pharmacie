<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MouvementStock extends Model
{
    // 1. On ajoute 'utilisateur_id' ici pour permettre l'enregistrement de l'auteur
    protected $fillable = [
        'produit_id', 
        'utilisateur_id', // <--- AJOUTÉ
        'type',           // 'ENTREE' ou 'SORTIE'
        'quantite', 
        'motif', 
        'date'
    ];

    // 2. Relation avec le produit (déjà là, c'est parfait)
    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    // 3. LA PIÈCE MANQUANTE : Relation avec l'utilisateur
    // C'est ce qui permet d'afficher le nom du pharmacien dans l'historique
    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}