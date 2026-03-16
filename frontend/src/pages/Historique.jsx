import { useState, useEffect } from 'react';
import { History, ArrowUpRight, ArrowDownLeft, Calendar, User, AlertCircle, RefreshCw } from 'lucide-react';

export default function Historique() {
  const [mouvements, setMouvements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchMouvements = () => {
    setLoading(true);
    setError(null);

    fetch('http://localhost:8000/api/mouvements', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
      }
    })
    .then(res => {
      if (!res.ok) throw new Error(`Erreur ${res.status} : Le serveur a rencontré un problème.`);
      return res.json();
    })
    .then(data => {
      // Sécurité : On vérifie si les données sont dans data.data ou directement dans data
      const finalData = Array.isArray(data) ? data : (data.data || []);
      setMouvements(finalData);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError(err.message);
      setLoading(false);
      setMouvements([]); // On remet à vide pour éviter le crash du .map
    });
  };

  useEffect(() => {
    fetchMouvements();
  }, []);

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Traçabilité des Stocks</h1>
          <p className="text-gray-500">Historique complet des entrées et sorties de la pharmacie.</p>
        </div>
        <button 
          onClick={fetchMouvements}
          className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors text-gray-600"
          title="Actualiser"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      
      {/* Affichage des erreurs si le serveur plante (Erreur 500) */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-2xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <p className="font-medium">Impossible de charger l'historique. Vérifiez que le contrôleur Laravel est correct.</p>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-widest">
            <tr>
              <th className="p-6 font-black">Type</th>
              <th className="p-6 font-black">Produit</th>
              <th className="p-6 font-black">Quantité</th>
              <th className="p-6 font-black">Auteur</th>
              <th className="p-6 font-black text-right">Date & Heure</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
               <tr>
                 <td colSpan="5" className="p-20 text-center text-gray-400 font-medium">
                    <RefreshCw size={40} className="animate-spin mx-auto mb-4 opacity-20" />
                    Chargement des mouvements...
                 </td>
               </tr>
            ) : mouvements.length > 0 ? (
              mouvements.map(m => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="p-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black ${
                      m.type === 'ENTREE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {m.type === 'ENTREE' ? <ArrowUpRight size={14}/> : <ArrowDownLeft size={14}/>}
                      {m.type}
                    </span>
                  </td>
                  <td className="p-6 font-bold text-gray-700">
                    {m.produit?.nom || <span className="text-gray-300 font-normal italic">Produit supprimé</span>}
                  </td>
                  <td className="p-6">
                    <span className="text-lg font-black text-gray-800">{m.quantite}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 bg-gray-100 w-fit px-3 py-1 rounded-lg">
                      <User size={14} className="text-[#76b09c]"/> 
                      {m.utilisateur?.name || "Système"}
                    </div>
                  </td>
                  <td className="p-6 text-right text-sm font-medium text-gray-400">
                    <div className="flex flex-col items-end">
                      <span>{new Date(m.created_at || m.date).toLocaleDateString('fr-FR')}</span>
                      <span className="text-[10px] opacity-60">{new Date(m.created_at || m.date).toLocaleTimeString('fr-FR')}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-20 text-center text-gray-400">
                   <History size={48} className="mx-auto mb-4 opacity-10" />
                   Aucun mouvement enregistré pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}