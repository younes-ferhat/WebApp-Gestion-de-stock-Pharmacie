import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, AlertCircle } from 'lucide-react';

export default function Produits() {
  // Données fictives (Mock data) pour le design
  const [produits] = useState([
    { id: 1, nom: 'Paracétamol 500mg', categorie: 'Analgésique', prix: 5.50, stock: 150, seuil: 20 },
    { id: 2, nom: 'Amoxicilline 1g', categorie: 'Antibiotique', prix: 12.90, stock: 8, seuil: 15 },
    { id: 3, nom: 'Sirop Humex', categorie: 'Sirop', prix: 8.20, stock: 45, seuil: 10 },
    { id: 4, nom: 'Doliprane Enfant', categorie: 'Analgésique', prix: 3.50, stock: 0, seuil: 25 },
  ]);

  // Fonction pour afficher l'état du stock avec des couleurs
  const getStockBadge = (stock, seuil) => {
    if (stock === 0) return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">Rupture</span>;
    if (stock <= seuil) return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">Stock Faible</span>;
    return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">En Stock</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header de la page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Produits</h1>
          <p className="text-gray-500">Consultez et gérez l'inventaire de la pharmacie.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#76b09c] hover:bg-[#5e8d7d] text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-200">
          <Plus size={20} />
          <span>Nouveau Produit</span>
        </button>
      </div>

      {/* Barre de recherche et Filtres */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un médicament, une molécule..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#76b09c]/50 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          <Filter size={18} />
          <span>Filtres</span>
        </button>
      </div>

      {/* Tableau des Produits */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">Produit</th>
                <th className="p-4 font-semibold text-gray-600">Catégorie</th>
                <th className="p-4 font-semibold text-gray-600">Prix Unit.</th>
                <th className="p-4 font-semibold text-gray-600">Quantité</th>
                <th className="p-4 font-semibold text-gray-600">Statut</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {produits.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{p.nom}</div>
                    <div className="text-xs text-gray-400 font-mono">ID: #{p.id.toString().padStart(4, '0')}</div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">{p.categorie}</td>
                  <td className="p-4 font-medium">{p.prix.toFixed(2)} €</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${p.stock <= p.seuil ? 'text-amber-600' : 'text-gray-700'}`}>
                        {p.stock}
                      </span>
                      {p.stock <= p.seuil && <AlertCircle size={14} className="text-amber-500" />}
                    </div>
                  </td>
                  <td className="p-4">{getStockBadge(p.stock, p.seuil)}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Simple */}
        <div className="p-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-500">
          <span>Affichage de {produits.length} produits</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Précédent</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
}