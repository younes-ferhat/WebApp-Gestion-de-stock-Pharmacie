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
            $request->validate(['question' => 'required|string']);
            $question = $request->input('question');
            $questionLower = strtolower($question); 

            $contexte = "";

           // 1. FORMATAGE ULTRA-LÉGER ET MATHS EN PHP (Anti-Hallucination)
            if (str_contains($questionLower, 'fournisseur') || str_contains($questionLower, 'partenaire') || str_contains($questionLower, 'contact')) {
                $total = Fournisseur::count(); // Le PHP compte avec 100% de précision
                $donnees = Fournisseur::limit(15)->get(['nom', 'telephone']);
                $contexte = "INFO EXACTE : Il y a $total fournisseurs au total. Liste: ";
                foreach($donnees as $d) { $contexte .= $d->nom . " (" . $d->telephone . "), "; }
            } 
            elseif (str_contains($questionLower, 'périme') || str_contains($questionLower, 'expiration') || str_contains($questionLower, 'lot')) {
                $total = Lot::where('date_peremption', '<', now()->addMonths(3))->count();
                $donnees = Lot::with('produit')->where('date_peremption', '<', now()->addMonths(3))->limit(15)->get();
                $contexte = "INFO EXACTE : Il y a $total lots qui expirent bientôt. Détails: ";
                foreach($donnees as $d) { $contexte .= $d->produit->nom . " (Expire: " . $d->date_peremption . "), "; }
            } 
          else {
                // Mode Super-Sniper : On coupe la question en mots pour chercher dans la BDD
                // preg_split sépare les mots par espaces, virgules, points d'interrogation...
                $mots = preg_split('/[\s,\?!\.]+/', $questionLower);
                $produitsTrouves = collect();
                
                foreach($mots as $mot) {
                    // On garde juste les mots de 4 lettres ou plus pour éviter les "de", "le", "les"...
                    // Et on ignore les mots de question courants
                    if (strlen($mot) >= 4 && !in_array($mot, ['combien', 'quel', 'quels', 'quelle', 'pour', 'dans', 'avec', 'sont', 'avez', 'vous'])) {
                        
                        // Cherche dans la BDD (ex: si tu tapes "doli", ça trouve "Doliprane 500mg")
                        $resultats = Produit::where('nom', 'LIKE', '%' . $mot . '%')->get(['nom', 'quantite_totale']);
                        $produitsTrouves = $produitsTrouves->merge($resultats);
                    }
                }

                // On enlève les doublons au cas où
                $produitsTrouves = $produitsTrouves->unique('nom');

                // Si on a trouvé le produit dans la base de données
                if ($produitsTrouves->count() > 0) {
                    $contexte = "INFO EXACTE : ";
                    foreach($produitsTrouves as $p) {
                        $contexte .= "Le produit " . $p->nom . " a un stock de EXACTEMENT " . $p->quantite_totale . " unités. ";
                    }
                } 
                // Si la question est trop vague ou le produit n'existe pas
                else {
                    $total = Produit::count();
                    $contexte = "INFO EXACTE : Il y a $total produits enregistrés au total. Dites à l'utilisateur de préciser le nom du produit.";
                }
            }
            // 2. RÈGLES ULTRA-STRICTES
            $systemRules = "Tu es l'assistant Pharmasol. RÈGLE ABSOLUE: Réponds en UNE SEULE PHRASE très courte. Va à l'essentiel, donne le chiffre ou le nom. Zéro bla-bla.";

            // 3. APPEL OLLAMA AVEC LES "OPTIONS TURBO"
            $baseUrl = env('OLLAMA_BASE_URL', 'http://host.docker.internal:11434');
            
            // On force le petit modèle ici pour être 100% sûr que le cache ne nous trompe pas
            $model = 'qwen2.5:1.5b'; 

            $response = Http::timeout(20)->post($baseUrl . '/api/generate', [
                'model' => $model,
                'prompt' => "$systemRules \n\n DONNÉES: $contexte \n\n QUESTION: $question \n\n RÉPONSE COURTE:",
                'stream' => false,
                'options' => [
                    'num_predict' => 40,   // Bloque l'IA à 40 mots maximum (gros gain de temps)
                    'temperature' => 0.0,  // Retire la "créativité", l'IA devient mathématique et ultra-rapide
                ]
            ]);

            if ($response->failed()) {
                throw new \Exception("Ollama n'a pas répondu à temps.");
            }

            $iaResponse = $response->json('response', 'Erreur de lecture.');

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