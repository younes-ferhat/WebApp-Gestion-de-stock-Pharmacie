import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Produits from './pages/Produits';
import AIChat from './pages/AIChat';
import { LayoutDashboard, Package, MessageSquare } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Barre de navigation latérale (Sidebar) */}
        <nav className="w-64 bg-[#76b09c] text-white flex flex-col p-4 space-y-4">
          <h2 className="text-2xl font-bold mb-8">Pharmasol</h2>
          
          <Link to="/" className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded">
            <LayoutDashboard size={20} />
            <span>Tableau de bord</span>
          </Link>
          
          <Link to="/produits" className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded">
            <Package size={20} />
            <span>Produits</span>
          </Link>
          
          <Link to="/ai-chat" className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded">
            <MessageSquare size={20} />
            <span>AI Chat</span>
          </Link>
        </nav>

        {/* Zone de contenu principal */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/produits" element={<Produits />} />
            <Route path="/ai-chat" element={<AIChat />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;