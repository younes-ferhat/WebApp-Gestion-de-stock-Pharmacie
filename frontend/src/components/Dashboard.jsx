// frontend/src/components/Dashboard.jsx

import { useState, useEffect } from 'react';
import authService from '../services/authService';

export default function Dashboard({ user, onLogout }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(user?.role === 'ADMIN');
  }, [user]);

  const handleLogout = async () => {
    await authService.logout();
    onLogout();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '50px auto' }}>
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '5px' }}>
        <h2>Bienvenue, {user?.name}!</h2>

        <div style={{ marginTop: '20px', backgroundColor: 'white', padding: '15px', borderRadius: '5px' }}>
          <h3>Informations:</h3>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Rôle:</strong> {user?.role === 'ADMIN' ? '👑 ADMIN' : '👤 EMPLOYE'}</p>
        </div>

        {isAdmin && (
          <div style={{ marginTop: '20px', backgroundColor: '#fff3cd', padding: '15px', borderRadius: '5px', border: '1px solid orange' }}>
            <h3>🔐 Accès Admin</h3>
            <p>Vous pouvez gérer les stocks et les utilisateurs</p>
          </div>
        )}

        {!isAdmin && (
          <div style={{ marginTop: '20px', backgroundColor: '#d1ecf1', padding: '15px', borderRadius: '5px', border: '1px solid blue' }}>
            <h3>👤 Accès Employé</h3>
            <p>Vous pouvez consulter les stocks</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
