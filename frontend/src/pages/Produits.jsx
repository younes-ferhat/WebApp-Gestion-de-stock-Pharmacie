import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, AlertCircle } from 'lucide-react';
// 1. On importe le composant de la modale
import AddProductModal from '../components/AddProductModal';

export default function Produits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 2. État pour gérer l'ouverture/fermeture de la modale
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 3. On extrait la logique de fetch dans une fonction réutilisable
  const fetchProduits = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/produits')
      .then((res) => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then((data) => {
        setProduits(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const getStockBadge = (stock, seuil) => {
    if (stock === 0) return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">Rupture</span>;
    if (stock <= seuil) return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">Stock Faible</span>;
    return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">En Stock</span>;
  };

  if (loading && produits.length === 0) return <div className="p-10 text-center font-medium text-gray-500">Connexion à l'inventaire...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Erreur : {error}</div>;

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Produits</h1>
          <p className="text-gray-500">Données en direct de la base Pharmasol.</p>
        </div>
        
        {/* 4. On déclenche l'ouverture de la modale au clic */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#76b09c] hover:bg-[#5e8d7d] text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} />
          <span>Nouveau Produit</span>
        </button>
      </div>

      {/* Recherche & Filtres */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher dans la base..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#76b09c]/50"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          <Filter size={18} />
          <span>Filtres</span>
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">Produit</th>
                <th className="p-4 font-semibold text-gray-600">Catégorie</th>
                <th className="p-4 font-semibold text-gray-600">Prix Unit.</th>
                <th className="p-4 font-semibold text-gray-600">Stock</th>
                <th className="p-4 font-semibold text-gray-600">Statut</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {produits.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{p.nom}</div>
                    <div className="text-xs text-gray-400 font-mono">{p.code_barre || `ID: #${p.id}`}</div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {p.categorie?.nom || 'Non classé'}
                  </td>
                  <td className="p-4 font-medium">{parseFloat(p.prix).toFixed(2)} €</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${p.quantite_totale <= p.seuil_alerte ? 'text-amber-600' : 'text-gray-700'}`}>
                        {p.quantite_totale}
                      </span>
                      {p.quantite_totale <= p.seuil_alerte && <AlertCircle size={14} className="text-amber-500" />}
                    </div>
                  </td>
                  <td className="p-4">{getStockBadge(p.quantite_totale, p.seuil_alerte)}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. On ajoute le composant Modale ici */}
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchProduits} 
      />
    </div>
  );
}