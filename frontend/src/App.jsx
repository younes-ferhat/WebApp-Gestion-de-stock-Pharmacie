import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Produits from './pages/Produits';
import AIChat from './pages/AIChat';
import authService from './services/authService';
import { LayoutDashboard, Package, MessageSquare, LogOut } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
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
    return <div style={{ padding: '20px', textAlign: 'center' }}>Chargement...</div>;
  }

  // Si pas connecté -> afficher Login
  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  // Si connecté -> afficher la navigation + les pages
  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 p-3 rounded-lg transition-all ${
      isActive
        ? 'bg-white/20 shadow-inner font-bold border-l-4 border-white'
        : 'hover:bg-white/10 opacity-80 hover:opacity-100'
    }`;

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 text-gray-900">

        {/* Barre de navigation latérale (Sidebar) */}
        <nav className="w-72 bg-[#76b09c] text-white flex flex-col p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-12 px-2">
            <div className="bg-white p-2 rounded-lg">
              <Package className="text-[#76b09c]" size={24} />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Pharmasol</h2>
          </div>

          {/* Info utilisateur */}
          <div className="mb-6 p-3 bg-white/10 rounded-lg">
            <p className="text-sm opacity-80">Connecté en tant que:</p>
            <p className="font-bold">{user?.name}</p>
            <p className="text-xs opacity-70">{user?.role}</p>
          </div>

          <div className="flex flex-col space-y-2">
            <NavLink to="/" className={navLinkClass}>
              <LayoutDashboard size={22} />
              <span>Tableau de bord</span>
            </NavLink>

            <NavLink to="/produits" className={navLinkClass}>
              <Package size={22} />
              <span>Gestion Produits</span>
            </NavLink>

            <NavLink to="/ai-chat" className={navLinkClass}>
              <MessageSquare size={22} />
              <span>Assistant IA</span>
            </NavLink>
          </div>

          {/* Bouton déconnexion */}
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all text-white border-t border-white/20 pt-6"
          >
            <LogOut size={22} />
            <span>Déconnexion</span>
          </button>

          {/* Petit pied de page dans la sidebar */}
          <div className="mt-4 text-xs opacity-60">
            <p>© 2026 Pharmasol v1.0</p>
          </div>
        </nav>

        {/* Zone de contenu principal avec scroll si nécessaire */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-10">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/produits" element={<Produits />} />
              <Route path="/ai-chat" element={<AIChat />} />
            </Routes>
          </div>
        </main>

      </div>
    </Router>
  );
}

export default App;
