import { useState } from 'react';
import authService from '../services/authService';
import { Mail, Lock, Eye, EyeOff, Pill, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Nettoyage des espaces pour éviter les erreurs idiotes
      const data = await authService.login(email.trim(), password);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Identifiants invalides. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      {/* Background Decoratif */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#76b09c]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-[450px] z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#76b09c] rounded-3xl shadow-xl shadow-[#76b09c]/20 mb-4 animate-bounce-subtle">
            <Pill size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Pharmasol</h1>
          <p className="text-gray-500 mt-2 font-medium">Système de Gestion d'Officine</p>
        </div>

        {/* Card de Connexion */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Ravi de vous revoir</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-center gap-3 animate-shake">
              <AlertCircle size={20} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Email Professionnel</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400 group-focus-within:text-[#76b09c] transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl leading-tight focus:outline-none focus:bg-white focus:border-[#76b09c] focus:ring-4 focus:ring-[#76b09c]/10 transition-all text-gray-800"
                  placeholder="admin@pharmacie.local"
                  required
                />
              </div>
            </div>

            {/* Champ Mot de Passe */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Mot de passe</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400 group-focus-within:text-[#76b09c] transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl leading-tight focus:outline-none focus:bg-white focus:border-[#76b09c] focus:ring-4 focus:ring-[#76b09c]/10 transition-all text-gray-800"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Bouton de Soumission */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-4 px-6 bg-[#76b09c] hover:bg-[#5e8d7d] text-white text-lg font-bold rounded-2xl transition-all shadow-lg shadow-[#76b09c]/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Section de Test (Subtile) */}
        <div className="mt-8 bg-gray-200/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 text-center">Accès de test (Développement)</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-[11px] text-gray-600">
              <span className="font-bold block text-[#76b09c]">ADMIN</span>
              admin@pharmacie.local / password123
            </div>
            <div className="text-[11px] text-gray-600 border-l border-gray-300 pl-4">
              <span className="font-bold block text-blue-500">EMPLOYÉ</span>
              employe1@pharmacie.local / password123
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-gray-400">
          &copy; 2026 Pharmasol. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}