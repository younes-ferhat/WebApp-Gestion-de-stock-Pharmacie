import { useState, useEffect } from 'react';
import { X, Calendar, Package, Hash, ChevronRight } from 'lucide-react';

export default function AddLotModal({ isOpen, onClose, onRefresh }) {
  const [produits, setProduits] = useState([]);
  const [formData, setFormData] = useState({
    produit_id: '',
    numero_lot: '',
    quantite: '',
    date_peremption: ''
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:8000/api/produits', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setProduits(data));
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      onRefresh();
      onClose();
      setFormData({ produit_id: '', numero_lot: '', quantite: '', date_peremption: '' });
    } else {
      alert("Erreur lors de la réception du lot.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Réception de Commande</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Sélectionner le produit</label>
            <select 
              required
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#76b09c]"
              value={formData.produit_id}
              onChange={e => setFormData({...formData, produit_id: e.target.value})}
            >
              <option value="">Choisir un médicament...</option>
              {produits.map(p => (
                <option key={p.id} value={p.id}>{p.nom} (Stock actuel: {p.quantite_totale})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase text-gray-400 mb-1 block">N° de Lot</label>
              <input required placeholder="ex: LOT-2024" className="w-full p-3 bg-gray-50 border rounded-xl"
                value={formData.numero_lot} onChange={e => setFormData({...formData, numero_lot: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Quantité reçue</label>
              <input required type="number" className="w-full p-3 bg-gray-50 border rounded-xl"
                value={formData.quantite} onChange={e => setFormData({...formData, quantite: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Date de péremption</label>
            <input required type="date" className="w-full p-3 bg-gray-50 border rounded-xl"
              value={formData.date_peremption} onChange={e => setFormData({...formData, date_peremption: e.target.value})} />
          </div>

          <button type="submit" className="w-full bg-[#76b09c] text-white py-4 rounded-2xl font-bold hover:bg-[#5e8d7d] transition-all flex items-center justify-center gap-2">
            Enregistrer l'entrée en stock <ChevronRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}