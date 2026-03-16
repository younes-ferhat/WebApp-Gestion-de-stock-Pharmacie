import { useState, useEffect } from 'react';
import { History, ArrowUpRight, ArrowDownLeft, Calendar, User } from 'lucide-react';

export default function Historique() {
  const [mouvements, setMouvements] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:8000/api/mouvements', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setMouvements(data));
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Traçabilité des Stocks</h1>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="p-4 font-bold">Type</th>
              <th className="p-4 font-bold">Produit</th>
              <th className="p-4 font-bold">Quantité</th>
              <th className="p-4 font-bold">Auteur</th>
              <th className="p-4 font-bold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mouvements.map(m => (
              <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <span className={`flex items-center gap-1 font-bold ${m.type === 'ENTREE' ? 'text-green-600' : 'text-red-600'}`}>
                    {m.type === 'ENTREE' ? <ArrowUpRight size={16}/> : <ArrowDownLeft size={16}/>}
                    {m.type}
                  </span>
                </td>
                <td className="p-4 font-medium">{m.produit?.nom}</td>
                <td className="p-4 font-bold">{m.quantite}</td>
                <td className="p-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2"><User size={14}/> {m.utilisateur?.name}</div>
                </td>
                <td className="p-4 text-sm text-gray-400">
                  {new Date(m.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}