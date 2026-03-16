<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Produit;
use App\Models\Lot;

class AssistantController extends Controller
{
    public function ask(Request $request)
    {
        try {
            // 1. Validation de la question
            $request->validate(['question' => 'required|string']);
            $question = $request->input('question');
            $questionLower = strtolower($question);

            // 2. LOGIQUE D'EXTRACTION : On adapte les données au sujet de la question
            $contexte = "";

            if (str_contains($questionLower, 'périme') || str_contains($questionLower, 'expiration') || str_contains($questionLower, 'lot')) {
                // Si on parle de lots ou de péremption, on va chercher TOUS les lots (pas seulement les périmés)
                // pour que l'IA puisse répondre à "Combien de lots existe"
                $donnees = Lot::with('produit')->get();
                $contexte = "Données des lots en stock (incluant dates expiration et produits liés) : " . $donnees->toJson();
            } else {
                // Sinon, on donne l'état général des produits
                $donnees = Produit::all(['nom', 'quantite_totale', 'seuil_alerte']);
                $contexte = "État actuel des stocks par produit : " . $donnees->toJson();
            }

            // 3. Règles de comportement (Ajustées pour être moins agressives)
            $systemRules = "Tu es l'assistant de gestion expert de la pharmacie Pharmasol. 
            TON RÔLE :
            1. Répondre aux questions sur les médicaments, les stocks, les LOTS, les dates de péremption et les fournisseurs.
            2. La gestion des LOTS est une partie centrale de ton travail. Si on te demande 'combien de lots existe', analyse les données JSON fournies pour compter.
            3. Si et SEULEMENT SI la question est totalement étrangère à la gestion (ex: 'quel temps fait-il ?'), réponds : 'Désolé, en tant qu'assistant Pharmasol, je suis programmé uniquement pour vous aider dans la gestion de votre pharmacie.'
            4. Utilise UNIQUEMENT les données JSON fournies pour donner des chiffres exacts.
            5. Sois concis, professionnel et réponds en français.";

            // 4. APPEL à Ollama
            $response = Http::timeout(120)->post('http://localhost:11434/api/generate', [
                'model' => 'gemma3:4b', 
                'prompt' => "INSTRUCTIONS : $systemRules \n\n DONNÉES DISPONIBLES : $contexte \n\n QUESTION DE L'UTILISATEUR : $question \n\n RÉPONSE :",
                'stream' => false,
            ]);

            // 5. Vérification de la réponse
            if ($response->failed()) {
                throw new \Exception("Ollama n'a pas pu traiter la demande.");
            }

            return response()->json([
                'status' => 'success',
                'reponse' => $response->json()['response']
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur technique : ' . $e->getMessage()
            ], 500);
        }
    }
}