import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, User as UserIcon, Mail, X, AlertCircle, CheckCircle } from 'lucide-react';

export default function Utilisateurs() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // États pour les formulaires et erreurs
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'EMPLOYE' });
  const [formError, setFormError] = useState(null);

  // État pour la suppression
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, userId: null, userName: '' });

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/users', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // --- LOGIQUE D'AJOUT ---
  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError(null);

    const res = await fetch('http://localhost:8000/api/users', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (res.ok) {
      fetchUsers();
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'EMPLOYE' });
    } else {
      // Si Laravel renvoie une erreur (ex: mdp trop court ou email déjà pris)
      setFormError(data.message || "Vérifiez les informations saisies (MDP: 8 caractères min)");
    }
  };

  // --- LOGIQUE DE SUPPRESSION ---
  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/users/${deleteConfig.userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== deleteConfig.userId));
        setDeleteConfig({ isOpen: false, userId: null, userName: '' });
      }
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion du Personnel</h1>
          <p className="text-gray-500">Administrez les comptes de votre équipe Pharmasol.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#76b09c] hover:bg-[#5e8d7d] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-100"
        >
          <UserPlus size={20} />
          <span>Ajouter un employé</span>
        </button>
      </div>

      {/* GRILLE DES UTILISATEURS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Chargement des comptes...</p>
        ) : (
          users.map(u => (
            <div key={u.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-2 h-full ${u.role === 'ADMIN' ? 'bg-purple-500' : 'bg-[#76b09c]'}`}></div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-[#76b09c]'}`}>
                  {u.role === 'ADMIN' ? <Shield size={24} /> : <UserIcon size={24} />}
                </div>
                {u.email !== 'admin@pharmacie.local' && (
                  <button 
                    onClick={() => setDeleteConfig({ isOpen: true, userId: u.id, userName: u.name })}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-800">{u.name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <Mail size={14} /> {u.email}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-[#76b09c]'}`}>
                  {u.role}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- MODALE D'AJOUT --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Nouveau Compte</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20}/></button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 text-sm font-medium">
                  <AlertCircle size={18} /> {formError}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Nom complet</label>
                <input required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#76b09c]"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Email professionnel</label>
                <input required type="email" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#76b09c]"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Mot de passe (8+ caractères)</label>
                <input required type="password" name="new-password" autoComplete="new-password" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#76b09c]"
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Rôle système</label>
                <select className="w-full p-3 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#76b09c]"
                  value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="EMPLOYE">Employé (Vendeur)</option>
                  <option value="ADMIN">Administrateur (Gérant)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#76b09c] text-white py-4 rounded-2xl font-bold hover:bg-[#5e8d7d] transition-all shadow-lg mt-2">
                Confirmer la création
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODALE DE SUPPRESSION --- */}
      {deleteConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl text-center overflow-hidden animate-in zoom-in-95">
            <div className="p-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Supprimer l'accès ?</h3>
              <p className="text-sm text-gray-500 mt-2">
                Êtes-vous sûr de vouloir révoquer l'accès de <span className="font-bold text-gray-800">{deleteConfig.userName}</span> ?
              </p>
            </div>
            <div className="bg-gray-50 p-4 flex flex-col gap-2">
              <button onClick={confirmDelete} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700">Supprimer définitivement</button>
              <button onClick={() => setDeleteConfig({ isOpen: false, userId: null, userName: '' })} className="w-full bg-white text-gray-600 border py-3 rounded-xl font-bold">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}