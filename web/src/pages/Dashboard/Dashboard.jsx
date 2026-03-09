import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { api } from "../../services/api.js";
import {
  ShoppingCart,
  TrendingUp,
  LayoutDashboard,
  QrCode,
  Package,
  Store,
  DollarSign,
} from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.idUsuario || user?.id || user?.sub || "anon";

  const userInitials = user?.nome
    ? user.nome.substring(0, 2).toUpperCase()
    : "VF";

  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const prods = await api.getProdutos(userId);
        const peds = await api.getPedidos(userId);
        setProdutos(prods);
        setPedidos(peds);
      } catch (e) {
        console.error("Erro ao conectar com db.json", e);
      }
    }
    carregarDados();
  }, [userId]);

  const totalProdutos = produtos.length;

  // Cálculos Financeiros
  const hoje = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const vendasDeHoje = pedidos.filter((p) => p.data.startsWith(hoje));

  const receitaHoje = vendasDeHoje.reduce((acc, p) => acc + p.total, 0);

  const lucroHoje = vendasDeHoje.reduce((accPedido, pedido) => {
    const lucroDoPedido = pedido.itens.reduce((accItem, item) => {
      const margem = item.preco - (item.custo || 0);
      return accItem + margem * item.qtd;
    }, 0);
    return accPedido + lucroDoPedido;
  }, 0);

  // Lógica do Gráfico de Barras (Últimos 5 dias)
  const ultimos5Dias = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (4 - i));
    const dataStr = d.toISOString().split("T")[0];
    const nomeDia =
      i === 4
        ? "Hoje"
        : d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
    const totalDia = pedidos
      .filter((p) => p.data.startsWith(dataStr))
      .reduce((acc, p) => acc + p.total, 0);
    return { label: nomeDia, total: totalDia, isToday: i === 4 };
  });

  const maiorVenda = Math.max(...ultimos5Dias.map((d) => d.total));
  const temVendasNaSemana = maiorVenda > 0;

  return (
    <div className="dashboard-layout">
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
        <section className="dashboard-section">
          <h2 className="section-title">Resumo de Hoje</h2>
          <div className="insights-grid">
            <div className="insight-card highlight-green">
              <div className="insight-header">
                <DollarSign size={16} />
                <span>Entrou Hoje</span>
              </div>
              <div className="insight-value">
                R$ {receitaHoje.toFixed(2).replace(".", ",")}
              </div>
              <div className="insight-trend">
                <span>{vendasDeHoje.length} venda(s) realizada(s)</span>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-header">
                <TrendingUp size={16} className="text-green" />
                <span>Seu Lucro</span>
              </div>
              <div className="insight-value text-green">
                R$ {lucroHoje.toFixed(2).replace(".", ",")}
              </div>
              <div className="insight-trend">
                <span>Margem calculada dos custos</span>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">Vendas da Semana</h2>
          <div
            className={`chart-card ${
              !temVendasNaSemana ? "chart-empty-state" : ""
            }`}
            style={{ paddingBottom: "40px", position: "relative" }}
          >
            {!temVendasNaSemana ? (
              <>
                <TrendingUp size={22} className="chart-empty-icon" />
                <p className="chart-empty-title">Sem vendas nesta semana</p>
                <p className="chart-empty-subtitle">
                  O gráfico será exibido quando houver movimentação.
                </p>
              </>
            ) : (
              <div
                className="simple-bar-chart"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  height: "140px",
                  marginTop: "20px",
                }}
              >
                {ultimos5Dias.map((dia, i) => {
                  const altura =
                    maiorVenda > 0 ? (dia.total / maiorVenda) * 100 : 0;
                  return (
                    <div
                      key={i}
                      className="bar-group"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flex: 1,
                        gap: "8px",
                        justifyContent: "flex-end",
                        height: "100%",
                      }}
                    >
                      {dia.total > 0 && (
                        <span style={{ fontSize: "10px", color: "#6b7280" }}>
                          R${dia.total}
                        </span>
                      )}
                      <div
                        className={`bar ${dia.isToday ? "today" : ""}`}
                        style={{
                          width: "24px",
                          backgroundColor: dia.isToday
                            ? "var(--vf-primary)"
                            : "var(--vf-primary-light)",
                          borderRadius: "6px 6px 0 0",
                          height: `${altura}%`,
                          minHeight: altura > 0 ? "4px" : "0",
                        }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            )}

            <div
              className="chart-days-row"
              style={{
                position: "absolute",
                bottom: "10px",
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "space-around",
                fontSize: "12px",
                color: "var(--vf-text-muted)",
                textTransform: "capitalize",
              }}
            >
              {ultimos5Dias.map((dia, i) => (
                <span
                  key={i}
                  style={
                    dia.isToday ? { fontWeight: "bold", color: "#374151" } : {}
                  }
                >
                  {dia.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="actions-grid">
            <button
              className="action-card primary-action"
              type="button"
              onClick={() => navigate("/caixa")}
            >
              <ShoppingCart size={34} className="action-icon text-white" />
              <span className="action-title text-white">Nova Venda</span>
            </button>
            <button
              className="action-card"
              type="button"
              onClick={() => navigate("/")}
            >
              <QrCode size={34} className="action-icon text-green" />
              <span className="action-title">Escanear</span>
            </button>
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="section-title flex-align">
            <Package size={18} className="text-orange" /> Status do Catálogo
          </h2>
          <div className="alert-list">
            <div
              className="alert-item"
              style={{
                borderLeftColor: totalProdutos > 0 ? "#0A7B6C" : "#f59e0b",
              }}
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
                className={`stock-badge ${
                  totalProdutos > 0 ? "ready" : "danger"
                }`}
                onClick={() => navigate("/estoque")}
              >
                {totalProdutos === 0 ? "Adicionar" : "Ver Estoque"}
              </button>
            </div>
          </div>
        </section>
      </main>

      <nav className="bottom-nav">
        <button
          className="nav-item active"
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          <div className="nav-icon-wrap">
            <LayoutDashboard size={22} />
          </div>
          <span>Início</span>
        </button>
        <button
          className="nav-item"
          type="button"
          onClick={() => navigate("/pedidos")}
        >
          <div className="nav-icon-wrap">
            <QrCode size={22} />
          </div>
          <span>Pedidos</span>
        </button>
        <button
          className="nav-item"
          type="button"
          onClick={() => navigate("/estoque")}
        >
          <div className="nav-icon-wrap">
            <Package size={22} />
          </div>
          <span>Estoque</span>
        </button>
        <button
          className="nav-item"
          type="button"
          onClick={() => navigate("/caixa")}
        >
          <div className="nav-icon-wrap">
            <Store size={22} />
          </div>
          <span>Caixa</span>
        </button>
      </nav>
    </div>
  );
}
