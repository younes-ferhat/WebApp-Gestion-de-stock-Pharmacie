<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Produit;
use App\Models\Lot;
use App\Models\Fournisseur;

class AssistantController extends Controller
{
    public function ask(Request $request)
    {
        try {
            // 1. Validation de la question
            $request->validate(['question' => 'required|string']);
            $question = $request->input('question');
            
            // On crée la variable pour éviter les problèmes de casse (majuscules/minuscules)
            $questionLower = strtolower($question); 

            // 2. Préparer le contexte en fonction de la question
            $contexte = "";

            // Cas A : Question sur les fournisseurs
            if (str_contains($questionLower, 'fournisseur') || str_contains($questionLower, 'partenaire') || str_contains($questionLower, 'contact')) {
                $donnees = Fournisseur::all();
                $contexte = "Liste des fournisseurs officiels de la pharmacie Pharmasol (avec contacts) : " . $donnees->toJson();
            } 
            // Cas B : Question sur les lots ou la péremption
            elseif (str_contains($questionLower, 'périme') || str_contains($questionLower, 'expiration') || str_contains($questionLower, 'lot')) {
                $donnees = Lot::with('produit')->where('date_peremption', '<', now()->addMonths(3))->get();
                $contexte = "Données des lots (incluant ceux proches de l'expiration) : " . $donnees->toJson();
            } 
            // Cas C : Question générale sur les stocks
            else {
                $donnees = Produit::with('fournisseur')->get(['nom', 'quantite_totale', 'seuil_alerte', 'fournisseur_id']);
                $contexte = "État actuel des stocks et fournisseurs associés par produit : " . $donnees->toJson();
            }

            // 3. Règles du système
            $systemRules = "Tu es l'assistant de gestion expert de la pharmacie Pharmasol. 
            TON RÔLE :
             1. Répondre aux questions sur les médicaments, les stocks, les LOTS, les dates de péremption et les FOURNISSEURS.
            2. Si on te demande 'Qui est le fournisseur de X', cherche l'information dans le JSON des produits ou des fournisseurs.
            3. La gestion des LOTS est centrale. Si on te demande 'combien de lots existe', compte-les dans les données fournies.
            4. Si la question est totalement étrangère à la gestion (ex: 'qui a gagné le match ?'), réponds : 'Désolé, en tant qu'assistant Pharmasol, je suis programmé uniquement pour vous aider dans la gestion de votre pharmacie.'
            5. Utilise UNIQUEMENT les données JSON pour donner des chiffres ou noms exacts.
            6. Sois concis, professionnel et réponds en français.";

            // 4. Appel à Ollama
            $response = Http::timeout(120)->post('http://localhost:11434/api/generate', [
                'model' => 'qwen2.5',
                'prompt' => "INSTRUCTIONS : $systemRules \n\n DONNÉES : $contexte \n\n QUESTION : $question \n\n RÉPONSE :",
                'stream' => false,
            ]);

            if ($response->failed()) {
                throw new \Exception("Ollama n'a pas pu traiter la demande.");
            }

            // 5. Récupération sécurisée de la réponse
            $iaResponse = $response->json('response', 'Pas de réponse générée.');

            return response()->json([
                'status' => 'success',
                'reponse' => $iaResponse
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur technique : ' . $e->getMessage()
            ], 500);
        }
    }
}