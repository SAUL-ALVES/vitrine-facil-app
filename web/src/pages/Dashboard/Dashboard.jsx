import React, { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext.jsx";
import { 
  ShoppingCart, 
  TrendingUp, 
  AlertCircle, 
  LayoutDashboard, 
  QrCode, 
  Package, 
  Store,
  DollarSign
} from 'lucide-react';
import './Dashboard.css';

const PRODUCTS_KEY = "vf_products";

function loadProducts(userId) {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    const all = JSON.parse(raw) || {};
    return all[userId] || [];
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const { user } = useAuth();
  const userId = user?.idUsuario || user?.id || user?.sub || "anon";
  
  // Extrai as iniciais do usuário ou usa VF como padrão
  const userInitials = user?.nome ? user.nome.substring(0, 2).toUpperCase() : "VF";

  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    setProdutos(loadProducts(userId));
  }, [userId]);

  const totalProdutos = produtos.length;
  
  // Informações zeradas por padrão, pois ainda não há fluxo de vendas 
  const vendasHoje = 0;
  const lucroHoje = 0;
  const chartHeight = "0%"; // Gráfico zerado

  return (
    <div className="dashboard-layout">
      {/* Cabeçalho */}
      <header className="top-header">
        <div className="logo-container">
          <div className="logo-badge">VF</div>
          <span className="logo-text">Vitrine<span className="text-orange">Fácil</span></span>
        </div>
        <div className="header-actions">
          <div className="user-avatar">{userInitials}</div>
        </div>
      </header>

      <main className="main-content">
        
        {/* INSIGHTS FINANCEIROS */}
        <section className="dashboard-section">
          <h2 className="section-title">Resumo de Hoje</h2>
          
          <div className="insights-grid">
            <div className="insight-card highlight-green">
              <div className="insight-header">
                <DollarSign size={20} />
                <span>Entrou Hoje</span>
              </div>
              <div className="insight-value">R$ 0,00</div>
              <div className="insight-trend">
                <span>Sem vendas hoje</span>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-header">
                <TrendingUp size={20} className="text-green" />
                <span>Seu Lucro</span>
              </div>
              <div className="insight-value text-green">R$ 0,00</div>
              <div className="insight-trend">
                <span>Aprox. 30% das vendas</span>
              </div>
            </div>
          </div>
        </section>

        {/* GRÁFICO ZERADO */}
        <section className="dashboard-section">
          <h2 className="section-title">Vendas da Semana</h2>
          <div className="chart-card">
            <div className="simple-bar-chart">
              <div className="bar-group">
                <div className="bar" style={{ height: chartHeight }}></div>
                <span className="day-label">Seg</span>
              </div>
              <div className="bar-group">
                <div className="bar" style={{ height: chartHeight }}></div>
                <span className="day-label">Ter</span>
              </div>
              <div className="bar-group">
                <div className="bar" style={{ height: chartHeight }}></div>
                <span className="day-label">Qua</span>
              </div>
              <div className="bar-group">
                <div className="bar" style={{ height: chartHeight }}></div>
                <span className="day-label">Qui</span>
              </div>
              <div className="bar-group">
                <div className="bar today" style={{ height: chartHeight }}></div>
                <span className="day-label fw-bold">Hoje</span>
              </div>
            </div>
          </div>
        </section>

        {/* BOTÕES DE AÇÃO PRINCIPAIS */}
        <section className="dashboard-section">
          <div className="actions-grid">
            <button className="action-card primary-action">
              <ShoppingCart size={40} className="action-icon text-white" />
              <span className="action-title text-white">Nova Venda</span>
            </button>
            <button className="action-card">
              <QrCode size={40} className="action-icon text-green" />
              <span className="action-title">Escanear</span>
            </button>
          </div>
        </section>

        {/* STATUS GERAL DE ESTOQUE */}
        <section className="dashboard-section">
          <h2 className="section-title flex-align">
            <Package size={20} className="text-orange" /> Status do Catálogo
          </h2>
          <div className="alert-list">
            <div className="alert-item" style={{ borderLeftColor: totalProdutos > 0 ? '#0A7B6C' : '#f59e0b' }}>
              <span className="product-name">
                {totalProdutos === 0 
                  ? "Seu catálogo está vazio." 
                  : `Você possui ${totalProdutos} produto(s) cadastrado(s).`}
              </span>
              <span className={`stock-badge ${totalProdutos > 0 ? 'ready' : 'danger'}`}>
                {totalProdutos === 0 ? "Adicionar" : "Ver Estoque"}
              </span>
            </div>
          </div>
        </section>

      </main>

      {/* Navegação Inferior */}
      <nav className="bottom-nav">
        <button className="nav-item active">
          <LayoutDashboard size={24} />
          <span>Início</span>
        </button>
        <button className="nav-item">
          <QrCode size={24} />
          <span>Pedidos</span>
        </button>
        <button className="nav-item">
          <Package size={24} />
          <span>Estoque</span>
        </button>
        <button className="nav-item">
          <Store size={24} />
          <span>Caixa</span>
        </button>
      </nav>
    </div>
  );
}