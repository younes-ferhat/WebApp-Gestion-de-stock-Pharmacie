import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Produits from './pages/Produits';
import AIChat from './pages/AIChat';
import Utilisateurs from './pages/Utilisateurs'; 
import Fournisseurs from './pages/Fournisseurs';
import Historique from './pages/Historique'; // <--- Import de la nouvelle page
import authService from './services/authService';

// Ajout de History et Building2 dans les icônes
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  LogOut, 
  Users, 
  Building2, 
  History 
} from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  if (loading) {
    return <div className="p-10 text-center font-medium">Chargement du système...</div>;
  }

  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 p-3 rounded-lg transition-all ${
      isActive
        ? 'bg-white/20 shadow-inner font-bold border-l-4 border-white'
        : 'hover:bg-white/10 opacity-80 hover:opacity-100'
    }`;

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 text-gray-900">

        {/* BARRE LATÉRALE (SIDEBAR) */}
        <nav className="w-72 bg-[#76b09c] text-white flex flex-col p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-12 px-2">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Package className="text-[#76b09c]" size={24} />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Pharmasol</h2>
          </div>

          <div className="mb-8 p-4 bg-black/10 rounded-2xl border border-white/10">
            <p className="text-xs uppercase tracking-widest opacity-60 mb-1">Session active</p>
            <p className="font-bold truncate">{user?.name}</p>
            <p className="text-[10px] mt-1 inline-block px-2 py-0.5 bg-white/20 rounded-md uppercase font-black">
              {user?.role}
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <NavLink to="/" className={navLinkClass}>
              <LayoutDashboard size={20} />
              <span>Tableau de bord</span>
            </NavLink>

            <NavLink to="/produits" className={navLinkClass}>
              <Package size={20} />
              <span>Gestion Produits</span>
            </NavLink>

            <NavLink to="/fournisseurs" className={navLinkClass}>
              <Building2 size={20} />
              <span>Fournisseurs</span>
            </NavLink>

            {/* LIEN HISTORIQUE (Traçabilité) */}
            <NavLink to="/historique" className={navLinkClass}>
              <History size={20} />
              <span>Historique</span>
            </NavLink>

            {/* SEUL L'ADMIN VOIT CE BOUTON */}
            {user?.role === 'ADMIN' && (
              <NavLink to="/personnel" className={navLinkClass}>
                <Users size={20} />
                <span>Gestion Personnel</span>
              </NavLink>
            )}

            <NavLink to="/ai-chat" className={navLinkClass}>
              <MessageSquare size={20} />
              <span>Assistant IA</span>
            </NavLink>
          </div>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/20 transition-all text-white border-t border-white/10 pt-6"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </nav>

        {/* ZONE DE CONTENU PRINCIPAL */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="p-10 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/produits" element={<Produits />} />
              <Route path="/fournisseurs" element={<Fournisseurs />} />
              
              {/* Route pour l'Historique */}
              <Route path="/historique" element={<Historique />} />
              
              <Route path="/ai-chat" element={<AIChat />} />
              
              <Route 
                path="/personnel" 
                element={
                  user?.role === 'ADMIN' ? <Utilisateurs /> : <Navigate to="/produits" replace />
                } 
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

      </div>
    </Router>
  );
}

export default App;