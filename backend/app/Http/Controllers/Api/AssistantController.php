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

            // 2. LOGIQUE ST3 : Identification de l'intention et extraction SQL
            $contexte = "";

            if (str_contains(strtolower($question), 'périme') || str_contains(strtolower($question), 'expiration')) {
                $donnees = Lot::with('produit')->where('date_peremption', '<', now()->addMonths(3))->get();
                $contexte = "Données des lots proches expiration : " . $donnees->toJson();
            } else {
                $donnees = Produit::all(['nom', 'quantite_totale', 'seuil_alerte']);
                $contexte = "État actuel des stocks : " . $donnees->toJson();
            }

            // 3. Règles de comportement ultra-strictes (Tes règles !)
            $systemRules = "Tu es l'assistant de gestion expert de la pharmacie Pharmasol. 
            REGLES DE CONTEXTE :
            1. Tu ne dois répondre QU'À des questions liées à la pharmacie, aux médicaments, aux stocks ou aux fournisseurs.
            2. Si une question sort du contexte pharmaceutique (ex: cuisine, sport, météo), réponds : 'Désolé, en tant qu'assistant Pharmasol, je suis programmé uniquement pour vous aider dans la gestion de votre pharmacie.'
            3. Utilise UNIQUEMENT les données JSON fournies pour tes calculs.
            4. Ne donne jamais de conseils médicaux graves.
            5. Sois concis, professionnel et réponds en français.";

            // 4. UN SEUL APPEL à Ollama avec les instructions ET le contexte
            $response = Http::timeout(120)->post('http://localhost:11434/api/generate', [
                'model' => 'gemma3:4b', 
                'prompt' => "INSTRUCTIONS : $systemRules \n\n DONNÉES : $contexte \n\n QUESTION : $question \n\n RÉPONSE :",
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