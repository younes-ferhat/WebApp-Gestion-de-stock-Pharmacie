import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Produits from './pages/Produits';
import AIChat from './pages/AIChat';
import Utilisateurs from './pages/Utilisateurs'; 
import Fournisseurs from './pages/Fournisseurs';
import Historique from './pages/Historique'; 
import authService from './services/authService';

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
    return <div className="p-10 text-center font-medium text-[#76b09c]">Initialisation du système...</div>;
  }

  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 p-3 rounded-xl transition-all ${
      isActive
        ? 'bg-white/20 shadow-inner font-bold border-l-4 border-white'
        : 'hover:bg-white/10 opacity-80 hover:opacity-100'
    }`;

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">

        {/* --- BARRE LATÉRALE (SIDEBAR) --- */}
        <nav className="w-72 bg-[#76b09c] text-white flex flex-col p-6 shadow-2xl z-20">
          <div className="flex items-center space-x-3 mb-10 px-2">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <Package className="text-[#76b09c]" size={24} />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Pharmasol</h2>
          </div>

          <div className="mb-8 p-4 bg-black/10 rounded-2xl border border-white/10">
            <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1 font-bold">Session active</p>
            <p className="font-bold truncate text-sm">{user?.name}</p>
            <p className="text-[9px] mt-2 inline-block px-2 py-0.5 bg-white text-[#76b09c] rounded-md uppercase font-black">
              {user?.role}
            </p>
          </div>

          <div className="flex flex-col space-y-1">
            <NavLink to="/" className={navLinkClass}>
              <LayoutDashboard size={18} />
              <span>Tableau de bord</span>
            </NavLink>

            <NavLink to="/produits" className={navLinkClass}>
              <Package size={18} />
              <span>Gestion Produits</span>
            </NavLink>

            <NavLink to="/fournisseurs" className={navLinkClass}>
              <Building2 size={18} />
              <span>Fournisseurs</span>
            </NavLink>

            <NavLink to="/historique" className={navLinkClass}>
              <History size={18} />
              <span>Historique</span>
            </NavLink>

            {user?.role === 'ADMIN' && (
              <NavLink to="/personnel" className={navLinkClass}>
                <Users size={18} />
                <span>Gestion Personnel</span>
              </NavLink>
            )}

            <NavLink to="/ai-chat" className={navLinkClass}>
              <MessageSquare size={18} />
              <span>Assistant IA</span>
            </NavLink>
          </div>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center space-x-3 p-3 rounded-xl hover:bg-rose-500/20 transition-all text-white border-t border-white/10 pt-6 group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-bold">Déconnexion</span>
          </button>
        </nav>

        {/* --- ZONE DE CONTENU PRINCIPAL --- */}
        <main className="flex-1 overflow-y-auto bg-gray-50 flex flex-col relative">
          <div className="p-8 md:p-12 max-w-7xl mx-auto w-full flex-1">
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/produits" element={<Produits />} />
              <Route path="/fournisseurs" element={<Fournisseurs />} />
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

          {/* --- NOTE DE PROTOTYPE (FOOTER) --- */}
          <footer className="py-6 flex justify-center items-center pointer-events-none">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-amber-50 border border-amber-100 rounded-full shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em]">
                Version Prototype • Pharmasol v1.0 • Données de simulation
              </p>
            </div>
          </footer>
        </main>

      </div>
    </Router>
  );
}

export default App;