import { useState, useEffect } from 'react';
import { Plus, Search, Phone, Mail, Building2, Trash2, X, PlusCircle } from 'lucide-react';

export default function Fournisseurs() {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nom: '', email: '', telephone: '' });
  const token = localStorage.getItem('token');

  const fetchFournisseurs = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/fournisseurs', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const data = await res.json();
      setFournisseurs(data);
    } catch (err) { console.error("Erreur:", err); }
  };

  useEffect(() => { fetchFournisseurs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/api/fournisseurs', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      fetchFournisseurs();
      setIsModalOpen(false);
      setFormData({ nom: '', email: '', telephone: '' });
    }
  };

  const deleteFournisseur = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce partenaire ?")) return;
    await fetch(`http://localhost:8000/api/fournisseurs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchFournisseurs();
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Partenaires & Fournisseurs</h1>
          <p className="text-gray-500">Liste des laboratoires et distributeurs officiels.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#76b09c] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#5e8d7d] transition-all shadow-lg active:scale-95"
        >
          <PlusCircle size={20} />
          <span>Nouveau Fournisseur</span>
        </button>
      </div>

      {/* Grid Fournisseurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fournisseurs.length > 0 ? (
          fournisseurs.map(f => (
            <div key={f.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-[#76b09c]/50 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-10 -mt-10 group-hover:bg-emerald-50 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-4 bg-emerald-50 text-[#76b09c] rounded-2xl">
                  <Building2 size={28} />
                </div>
                <button 
                  onClick={() => deleteFournisseur(f.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-4">{f.nom}</h3>
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-2 rounded-lg">
                  <Mail size={16} className="text-[#76b09c]" />
                  <span className="text-sm truncate">{f.email || 'Non renseigné'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-2 rounded-lg">
                  <Phone size={16} className="text-[#76b09c]" />
                  <span className="text-sm">{f.telephone || 'Non renseigné'}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">Aucun fournisseur enregistré pour le moment.</p>
          </div>
        )}
      </div>

      {/* Modal Ajout */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Ajouter un partenaire</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 ml-1">Nom du Laboratoire</label>
                <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#76b09c]"
                  value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 ml-1">Email professionnel</label>
                <input type="email" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#76b09c]"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 ml-1">Téléphone</label>
                <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#76b09c]"
                  value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-[#76b09c] text-white py-4 rounded-2xl font-bold hover:bg-[#5e8d7d] transition-all shadow-lg mt-4">
                Enregistrer le partenaire
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}