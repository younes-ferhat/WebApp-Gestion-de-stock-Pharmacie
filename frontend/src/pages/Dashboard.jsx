import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  ShieldAlert,
  Clock,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({
    total_alertes_stock: 0,
    total_alertes_peremption: 0,
    produits_critiques: [],
    lots_expirants: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/api/alertes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.status === 'success') {
          setStats({
            total_alertes_stock: data.stats.total_alertes_stock,
            total_alertes_peremption: data.stats.total_alertes_peremption,
            produits_critiques: data.donnees.produits_en_rupture_proche || [],
            lots_expirants: data.donnees.lots_expirant_bientot || []
          });
        }
      } catch (err) {
        console.error("Erreur stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* --- HEADER DE BIENVENUE ÉPURÉ --- */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">
          Hello, {user?.name} ! 👋
        </h1>
        <p className="text-gray-500 mt-3 text-lg font-medium">
          Voici l'état de la pharmacie pour ce <span className="text-[#76b09c] font-bold capitalize">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>.
        </p>
      </div>

      {/* --- CARTES DE STATS RAPIDES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ruptures */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:border-red-200 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-4 bg-red-50 text-red-500 rounded-2xl"><AlertTriangle size={28} /></div>
            <span className="text-4xl font-black text-gray-800">{stats.total_alertes_stock}</span>
          </div>
          <h3 className="mt-4 font-bold text-gray-600">Ruptures proches</h3>
          <p className="text-xs text-gray-400">Sous le seuil critique</p>
        </div>

        {/* Péremptions */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:border-amber-200 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl"><Clock size={28} /></div>
            <span className="text-4xl font-black text-gray-800">{stats.total_alertes_peremption}</span>
          </div>
          <h3 className="mt-4 font-bold text-gray-600">Péremptions &lt; 30j</h3>
          <p className="text-xs text-gray-400">Lots à retirer bientôt</p>
        </div>

        {/* Actions Rapides */}
        <div className="bg-[#76b09c] p-6 rounded-[2rem] shadow-lg shadow-[#76b09c]/20 text-white relative overflow-hidden group">
            <TrendingUp className="absolute right-[-10px] bottom-[-10px] size-32 opacity-10 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-4">Actions Rapides</h3>
            <div className="space-y-2 relative z-10">
                <Link to="/produits" className="flex items-center justify-between bg-white/20 p-3 rounded-xl hover:bg-white/30 transition-all">
                    <span className="text-sm font-bold">Inventaire</span>
                    <ArrowRight size={16} />
                </Link>
                <Link to="/historique" className="flex items-center justify-between bg-white/20 p-3 rounded-xl hover:bg-white/30 transition-all">
                    <span className="text-sm font-bold">Historique</span>
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
      </div>

      {/* --- LISTES DE DÉTAILS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stocks Critiques */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert className="text-red-500" />
            <h2 className="text-xl font-bold text-gray-800">Besoin de réapprovisionnement</h2>
          </div>
          <div className="space-y-4">
            {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-200" size={32} /></div>
            ) : stats.produits_critiques.length > 0 ? stats.produits_critiques.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-red-50/50 transition-colors">
                <div>
                  <p className="font-bold text-gray-800">{p.nom}</p>
                  <p className="text-[10px] uppercase font-bold text-gray-400">{p.categorie?.nom || 'Général'}</p>
                </div>
                <span className="px-3 py-1 bg-white border border-red-100 text-red-600 rounded-lg font-black text-xs">
                  {p.quantite_totale} en stock
                </span>
              </div>
            )) : <p className="text-center text-gray-400 py-4 font-medium italic">Tout est en règle ✅</p>}
          </div>
        </div>

        {/* Péremptions Proches */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-amber-500" />
            <h2 className="text-xl font-bold text-gray-800">Contrôle Qualité (Dates)</h2>
          </div>
          <div className="space-y-4">
            {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-200" size={32} /></div>
            ) : stats.lots_expirants.length > 0 ? stats.lots_expirants.map(l => (
              <div key={l.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-amber-50/50 transition-colors">
                <div>
                  <p className="font-bold text-gray-800">{l.produit?.nom}</p>
                  <p className="text-[10px] text-amber-600 font-black uppercase">Lot: {l.numero_lot}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-black text-gray-700">{new Date(l.date_peremption).toLocaleDateString()}</p>
                    <p className="text-[9px] uppercase font-bold text-gray-400">À retirer</p>
                </div>
              </div>
            )) : <p className="text-center text-gray-400 py-4 font-medium italic">Aucun lot à risque ✅</p>}
          </div>
        </div>
      </div>
    </div>
  );
}