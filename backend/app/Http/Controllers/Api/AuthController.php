<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use function Symfony\Component\String\u;



class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        /** @var User $user */
        $user = Auth::user();
        
        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role, // Retourne le rôle pour le frontend
            ],
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
{
    /** @var \App\Models\User $user */
    $user = $request->user();

    // On vérifie que l'utilisateur est bien là
    if ($user) {
        /** @var \Laravel\Sanctum\PersonalAccessToken $token */
        $token = $user->currentAccessToken();
        
        if ($token) {
            $token->delete(); // L'erreur disparaît ici !
        }

        return response()->json(['message' => 'Déconnecté']);
    }

    return response()->json(['message' => 'Utilisateur non trouvé'], 404);
}
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}