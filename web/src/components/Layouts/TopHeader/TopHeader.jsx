import { Bell, LogOut, Settings } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { authService } from '../../../services/auth.js';
import './TopHeader.css';

export default function TopHeader({ showActions = true, subtitle = null }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userInitials = user?.nome ? user.nome.substring(0, 2).toUpperCase() : "VF";

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <header className="top-header">
      <div className="logo-container">
        <div className="logo-badge">VF</div>
        <div className="logo-text-wrap" style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="logo-text">Vitrine<span className="text-orange">Fácil</span></span>
          {subtitle && <span className="logo-subtext" style={{ fontSize: '12px', color: 'var(--vf-text-muted)' }}>{subtitle}</span>}
        </div>
      </div>
      
      <div className="header-actions">
        {showActions ? (
          <>
            <button className="icon-btn" type="button"><Bell size={20} /></button>
            <button className="icon-btn" type="button"><Settings size={20} /></button>
            <button 
              className="icon-btn text-red" 
              type="button" 
              onClick={handleLogout}
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <div className="user-avatar">{userInitials}</div>
        )}
      </div>
    </header>
  );
}