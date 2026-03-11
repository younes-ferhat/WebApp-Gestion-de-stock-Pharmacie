import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, AlertCircle, X } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';

export default function Produits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- NOUVEL ÉTAT POUR LA MODALE DE SUPPRESSION ---
  const [deleteConfig, setDeleteConfig] = useState({ 
    isOpen: false, 
    productId: null, 
    productName: '' 
  });

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

  // --- LOGIQUE DE SUPPRESSION ---
  const openDeleteModal = (id, nom) => {
    setDeleteConfig({ isOpen: true, productId: id, productName: nom });
  };

  const closeDeleteModal = () => {
    setDeleteConfig({ isOpen: false, productId: null, productName: '' });
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/produits/${deleteConfig.productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProduits(produits.filter(p => p.id !== deleteConfig.productId));
        closeDeleteModal();
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    }
  };

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
                  <td className="p-4 text-gray-600 text-sm">{p.categorie?.nom || 'Non classé'}</td>
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
                      <button 
                        onClick={() => openDeleteModal(p.id, p.nom)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALE DE SUPPRESSION DESIGN --- */}
      {deleteConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Supprimer le produit ?</h3>
              <p className="text-sm text-gray-500 mt-2">
                Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-gray-800">{deleteConfig.productName}</span> ? Cette action est irréversible.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-col gap-2">
              <button
                onClick={handleConfirmDelete}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Confirmer la suppression
              </button>
              <button
                onClick={closeDeleteModal}
                className="w-full bg-white text-gray-600 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchProduits} 
      />
    </div>
  );
}