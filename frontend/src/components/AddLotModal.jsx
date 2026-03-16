import { useState, useEffect } from 'react';
import { X, Calendar, Package, Hash, ChevronRight, Inbox, Plus } from 'lucide-react';
export default function AddLotModal({ isOpen, onClose, onRefresh }) {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    produit_id: '',
    numero_lot: '',
    quantite: '',
    date_peremption: ''
  });

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem('token');
      fetch('http://localhost:8000/api/produits', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        // Sécurité pour le format des données (tableau direct ou objet data)
        const list = data.data || data;
        setProduits(Array.isArray(list) ? list : []);
      })
      .catch(err => console.error("Erreur lors du chargement des produits", err));
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:8000/api/lots', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        onRefresh(); // Recharge la liste des produits pour voir le nouveau stock
        onClose();   // Ferme la modale
        setFormData({ produit_id: '', numero_lot: '', quantite: '', date_peremption: '' });
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Erreur lors de la réception du lot.");
      }
    } catch (err) {
      alert("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header avec couleur douce */}
        <div className="p-8 border-b flex justify-between items-center bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#76b09c] text-white rounded-2xl shadow-lg shadow-[#76b09c]/20">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">Entrée en Stock</h2>
              <p className="text-xs text-[#76b09c] font-bold uppercase tracking-wider">Réception de commande</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <X size={24}/>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Sélection du Produit */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 ml-1">
              <Inbox size={14} /> Produit à réceptionner
            </label>
            <select 
              required
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#76b09c] transition-all appearance-none cursor-pointer"
              value={formData.produit_id}
              onChange={e => setFormData({...formData, produit_id: e.target.value})}
            >
              <option value="">-- Sélectionner un médicament --</option>
              {produits.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nom} (Stock actuel : {p.quantite_totale})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Numéro de Lot */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 ml-1">
                <Hash size={14} /> Numéro de Lot
              </label>
              <input 
                required 
                placeholder="ex: BATCH-882" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#76b09c]"
                value={formData.numero_lot} 
                onChange={e => setFormData({...formData, numero_lot: e.target.value})} 
              />
            </div>

            {/* Quantité */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 ml-1">
                <Plus size={14} className="text-[#76b09c]" /> Quantité Reçue
              </label>
              <input 
                required 
                type="number" 
                min="1"
                placeholder="0"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#76b09c] font-bold"
                value={formData.quantite} 
                onChange={e => setFormData({...formData, quantite: e.target.value})} 
              />
            </div>
          </div>

          {/* Date de Péremption */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 ml-1">
              <Calendar size={14} /> Date de Péremption
            </label>
            <input 
              required 
              type="date" 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#76b09c] cursor-pointer"
              value={formData.date_peremption} 
              onChange={e => setFormData({...formData, date_peremption: e.target.value})} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 ${loading ? 'bg-gray-400' : 'bg-[#76b09c] hover:bg-[#5e8d7d] shadow-[#76b09c]/20'}`}
          >
            {loading ? 'Enregistrement...' : "Confirmer l'entrée en stock"}
            {!loading && <ChevronRight size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
}