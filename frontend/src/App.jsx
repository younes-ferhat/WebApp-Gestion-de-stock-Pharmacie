import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Produits from './pages/Produits';
import AIChat from './pages/AIChat';
import { LayoutDashboard, Package, MessageSquare } from 'lucide-react';

function App() {
  // Petite fonction pour éviter de répéter les classes CSS du menu
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

          {/* Petit pied de page dans la sidebar */}
          <div className="mt-auto pt-6 border-t border-white/20 text-xs opacity-60">
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