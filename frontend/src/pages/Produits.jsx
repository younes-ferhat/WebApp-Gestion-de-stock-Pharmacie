import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle, PackagePlus, Loader2, CheckCircle2 } from 'lucide-react'; 
import AddProductModal from '../components/AddProductModal';
import AddLotModal from '../components/AddLotModal';

export default function Produits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);

  // On récupère l'utilisateur pour vérifier son rôle
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchProduits = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/produits', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const results = Array.isArray(data) ? data : (data.data || []);
        setProduits(results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // --- NOUVELLE FONCTION DE SUPPRESSION ---
  const handleDelete = async (id, nom) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${nom}" ?`)) {
      try {
        const res = await fetch(`http://localhost:8000/api/produits/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          fetchProduits(); // On rafraîchit la liste
        } else {
          alert("Erreur lors de la suppression. Le produit est peut-être lié à des lots.");
        }
      } catch (err) {
        alert("Erreur de connexion au serveur.");
      }
    }
  };

  useEffect(() => { fetchProduits(); }, []);

  return (
    <div className="space-y-6 p-4 md:p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Gestion des Produits</h1>
          <p className="text-gray-500 font-medium">Inventaire et flux de stock en temps réel.</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setIsLotModalOpen(true)}
            className="flex items-center gap-2 bg-white border-2 border-[#76b09c] text-[#76b09c] px-5 py-3 rounded-2xl font-bold hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
          >
            <PackagePlus size={20} />
            <span>Recevoir un Lot</span>
          </button>

          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#76b09c] text-white px-5 py-3 rounded-2xl font-bold hover:bg-[#5e8d7d] shadow-lg shadow-[#76b09c]/20 active:scale-95 transition-all"
            >
              <Plus size={20} />
              <span>Nouveau Produit</span>
            </button>
          )}
        </div>
      </div>

      {/* TABLEAU DES PRODUITS */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-widest">
            <tr>
              <th className="p-6 font-black">Produit</th>
              <th className="p-6 font-black text-center">Stock Total</th>
              <th className="p-6 font-black">Statut</th>
              {user?.role === 'ADMIN' && <th className="p-6 font-black text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="4" className="p-20 text-center">
                  <Loader2 size={40} className="animate-spin mx-auto text-[#76b09c] opacity-20" />
                </td>
              </tr>
            ) : produits.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-all group">
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-lg">{p.nom}</span>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">
                       {p.categorie?.nom || 'Sans catégorie'}
                    </span>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <span className={`text-xl font-black ${p.quantite_totale <= p.seuil_alerte ? 'text-rose-500' : 'text-gray-800'}`}>
                    {p.quantite_totale}
                  </span>
                </td>
                <td className="p-6">
                  {p.quantite_totale <= p.seuil_alerte ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-tighter animate-pulse">
                      <AlertCircle size={12} /> Stock Critique
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-tighter">
                      <CheckCircle2 size={12} /> En Stock
                    </span>
                  )}
                </td>
                
                {/* ACTIONS RÉSERVÉES À L'ADMIN */}
                {user?.role === 'ADMIN' && (
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-[#76b09c] hover:bg-emerald-50 rounded-xl transition-all">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id, p.nom)}
                        className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchProduits} />
      <AddLotModal isOpen={isLotModalOpen} onClose={() => setIsLotModalOpen(false)} onRefresh={fetchProduits} />
    </div>
  );
}