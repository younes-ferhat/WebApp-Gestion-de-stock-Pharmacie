import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, AlertCircle, Calendar, PackagePlus } from 'lucide-react'; 
import AddProductModal from '../components/AddProductModal';
import AddLotModal from '../components/AddLotModal'; // <--- IMPORT

export default function Produits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLotModalOpen, setIsLotModalOpen] = useState(false); // <--- ÉTAT MODALE LOT

  const user = JSON.parse(localStorage.getItem('user'));
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, productId: null, productName: '' });

  const fetchProduits = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/produits', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => { setProduits(data); setLoading(false); })
    .catch(err => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchProduits(); }, []);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Produits</h1>
          <p className="text-gray-500">Flux de stock en temps réel.</p>
        </div>

        <div className="flex gap-3">
          {/* BOUTON RECEVOIR UN LOT */}
          <button 
            onClick={() => setIsLotModalOpen(true)}
            className="flex items-center gap-2 bg-white border-2 border-[#76b09c] text-[#76b09c] px-5 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all active:scale-95"
          >
            <PackagePlus size={20} />
            <span>Recevoir un Lot</span>
          </button>

          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#76b09c] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#5e8d7d] shadow-lg active:scale-95"
            >
              <Plus size={20} />
              <span>Nouveau Produit</span>
            </button>
          )}
        </div>
      </div>

      {/* Reste du tableau (inchangé, garder la logique de péremption faite avant) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* ... (Tableau avec map produits) ... */}
      </div>

      {/* MODALES */}
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchProduits} 
      />

      {/* NOUVELLE MODALE LOT */}
      <AddLotModal 
        isOpen={isLotModalOpen} 
        onClose={() => setIsLotModalOpen(false)} 
        onRefresh={fetchProduits} 
      />
    </div>
  );
}