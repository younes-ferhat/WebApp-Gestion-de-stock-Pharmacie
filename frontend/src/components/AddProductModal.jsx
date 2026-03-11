import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AddProductModal({ isOpen, onClose, onRefresh }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    quantite_totale: '',
    seuil_alerte: 10,
    categorie_id: '',
    code_barre: ''
  });

  // Charger les catégories pour le menu déroulant
  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:8000/api/categories')
        .then(res => res.json())
        .then(data => setCategories(data));
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/produits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onRefresh(); // Recharger la liste des produits
        onClose();   // Fermer la modale
        setFormData({ nom: '', prix: '', quantite_totale: '', seuil_alerte: 10, categorie_id: '', code_barre: '' });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Ajouter un médicament</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
            <input required type="text" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pharmagreen outline-none" 
              onChange={(e) => setFormData({...formData, nom: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
              <input required type="number" step="0.01" className="w-full p-3 border rounded-xl"
                onChange={(e) => setFormData({...formData, prix: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité initiale</label>
              <input required type="number" className="w-full p-3 border rounded-xl"
                onChange={(e) => setFormData({...formData, quantite_totale: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select required className="w-full p-3 border rounded-xl bg-white"
              onChange={(e) => setFormData({...formData, categorie_id: e.target.value})}>
              <option value="">Choisir une catégorie</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>

          <button type="submit" className="w-full bg-[#76b09c] text-white py-4 rounded-2xl font-bold hover:bg-[#5e8d7d] transition-all shadow-lg shadow-emerald-100 mt-4">
            Enregistrer le produit
          </button>
        </form>
      </div>
    </div>
  );
}