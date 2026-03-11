import { Package, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  // Données de démonstration (on les connectera à Laravel plus tard)
  const stats = [
    { label: 'Stock Total', value: '12,500', icon: Package, color: 'bg-blue-500' },
    { label: 'Valeur du Stock', value: '45,780 €', icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Alertes Rupture', value: '12', icon: AlertTriangle, color: 'bg-rose-500' },
    { label: 'Mouvements (30j)', value: '+150', icon: TrendingUp, color: 'bg-amber-500' },
  ];

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
        <p className="text-gray-500">Aperçu en temps réel de votre stock officinal.</p>
      </header>
      
      {/* Grille des Cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder pour les graphiques futurs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80 flex flex-col items-center justify-center border-dashed border-2">
           <div className="text-gray-300 mb-2 font-medium italic">Graphique de péremption à venir...</div>
           <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden max-w-xs">
              <div className="bg-pharmagreen h-full w-2/3"></div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80 flex items-center justify-center border-dashed border-2 text-gray-300 font-medium italic">
          Derniers mouvements de stock...
        </div>
      </div>
    </div>
  );
}