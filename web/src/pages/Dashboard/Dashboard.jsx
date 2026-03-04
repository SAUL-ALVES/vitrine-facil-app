import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import {
  ShoppingCart,
  TrendingUp,
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.idUsuario || user?.id || user?.sub || "anon";

  const userInitials = user?.nome ? user.nome.substring(0, 2).toUpperCase() : "VF";

  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    setProdutos(loadProducts(userId));
  }, [userId]);

  const totalProdutos = produtos.length;

  const vendasHoje = 0;
  const lucroHoje = 0;

  return (
    <div className="dashboard-layout">
      {/* Cabeçalho */}
      <header className="top-header">
        <div className="logo-container">
          <div className="logo-badge">VF</div>
          <div className="logo-text-wrap">
            <span className="logo-text">
              Vitrine<span className="text-orange">Fácil</span>
            </span>
            <span className="logo-subtext">Dashboard do vendedor</span>
          </div>
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
                <DollarSign size={16} />
                <span>Entrou Hoje</span>
              </div>
              <div className="insight-value">
                R$ {vendasHoje.toFixed(2).replace('.', ',')}
              </div>
              <div className="insight-trend">
                <span>Sem vendas hoje</span>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-header">
                <TrendingUp size={16} className="text-green" />
                <span>Seu Lucro</span>
              </div>
              <div className="insight-value text-green">
                R$ {lucroHoje.toFixed(2).replace('.', ',')}
              </div>
              <div className="insight-trend">
                <span>Aprox. 30% das vendas</span>
              </div>
            </div>
          </div>
        </section>

        {/* VENDAS DA SEMANA (estado vazio) */}
        <section className="dashboard-section">
          <h2 className="section-title">Vendas da Semana</h2>

          <div className="chart-card chart-empty-state">
            <TrendingUp size={22} className="chart-empty-icon" />
            <p className="chart-empty-title">Sem vendas nesta semana</p>
            <p className="chart-empty-subtitle">
              O gráfico será exibido quando houver movimentação.
            </p>

            {/* Rodapé visual com dias (estilo da sua referência) */}
            <div className="chart-days-row">
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span className="today-label">Hoje</span>
            </div>
          </div>
        </section>

        {/* BOTÕES DE AÇÃO PRINCIPAIS */}
        <section className="dashboard-section">
          <div className="actions-grid">
            <button
              className="action-card primary-action"
              type="button"
              onClick={() => navigate("/products")} // troque para "/pdv" quando criar a rota
            >
              <ShoppingCart size={34} className="action-icon text-white" />
              <span className="action-title text-white">Nova Venda</span>
            </button>

            <button
              className="action-card"
              type="button"
              onClick={() => navigate("/products")} // troque para "/pedidos" ou "/scan" depois
            >
              <QrCode size={34} className="action-icon text-green" />
              <span className="action-title">Escanear</span>
            </button>
          </div>
        </section>

        {/* STATUS GERAL DE ESTOQUE */}
        <section className="dashboard-section">
          <h2 className="section-title flex-align">
            <Package size={18} className="text-orange" /> Status do Catálogo
          </h2>

          <div className="alert-list">
            <div
              className="alert-item"
              style={{ borderLeftColor: totalProdutos > 0 ? '#0A7B6C' : '#f59e0b' }}
            >
              <div className="alert-content">
                <span className="product-name">
                  {totalProdutos === 0
                    ? "Seu catálogo está vazio."
                    : `Você possui ${totalProdutos} produto(s) cadastrado(s).`}
                </span>
              </div>

              <button
                type="button"
                className={`stock-badge ${totalProdutos > 0 ? 'ready' : 'danger'}`}
                onClick={() => navigate("/estoque")}
              >
                {totalProdutos === 0 ? "Adicionar" : "Ver Estoque"}
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Navegação Inferior */}
      <nav className="bottom-nav">
        <button
          className="nav-item active"
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          <LayoutDashboard size={22} />
          <span>Início</span>
        </button>

        <button
          className="nav-item"
          type="button"
          onClick={() => navigate("/products")} // troque para "/pedidos" quando criar
        >
          <QrCode size={22} />
          <span>Pedidos</span>
          <span className="nav-badge">1</span>
        </button>

        <button
          className="nav-item"
          type="button"
          onClick={() => navigate("/estoque")}
        >
          <Package size={22} />
          <span>Estoque</span>
        </button>

        <button
          className="nav-item"
          type="button"
          onClick={() => navigate("/products")} // troque para "/pdv" quando criar
        >
          <Store size={22} />
          <span>Caixa</span>
        </button>
      </nav>
    </div>
  );
}