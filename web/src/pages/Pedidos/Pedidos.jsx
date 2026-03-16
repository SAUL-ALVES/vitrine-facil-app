import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { api } from "../../services/api.js";
import { 
  Search, Clock, CheckCircle, User, 
  LayoutDashboard, QrCode, Package, Store,
  Bell, Printer, Settings, ChevronRight, Plus
} from "lucide-react";
import "./Pedidos.css";

export default function Pedidos() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userId = user?.idUsuario || user?.id || user?.sub || "anon";
  const userInitials = user?.nome ? user.nome.substring(0, 2).toUpperCase() : "VF";
  const [showMenu, setShowMenu] = useState(false);

  const [pedidos, setPedidos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos"); // Todos, Pendente, Concluído

  useEffect(() => {
    async function carregarPedidos() {
      try {
        const data = await api.getPedidos(userId);
        // Ordena do mais recente para o mais antigo
        const ordenados = data.sort((a, b) => new Date(b.data) - new Date(a.data));
        setPedidos(ordenados);
      } catch (err) {
        console.error("Erro ao carregar pedidos", err);
      }
    }
    carregarPedidos();
  }, [userId]);

  // Filtra os pedidos com base na busca e nos botões rápidos
  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((p) => {
      const nomeCliente = p.cliente?.nome?.toLowerCase() || "cliente balcão";
      const matchBusca = nomeCliente.includes(busca.toLowerCase());
      
      const statusAtual = p.status || "Pendente"; // Se não tiver status, assume Pendente
      const matchStatus = filtroStatus === "Todos" || statusAtual === filtroStatus;

      return matchBusca && matchStatus;
    });
  }, [pedidos, busca, filtroStatus]);

  // Função para marcar o pedido como "Concluído"
  async function marcarComoConcluido(pedido) {
    try {
      const pedidoAtualizado = { ...pedido, status: "Concluído" };
      await api.updatePedido(pedido.id, pedidoAtualizado);
      
      // Atualiza a tela instantaneamente
      setPedidos((prev) => 
        prev.map((p) => (p.id === pedido.id ? pedidoAtualizado : p))
      );
    } catch (err) {
      alert("Erro ao atualizar o status do pedido.");
    }
  }

  // Helper para formatar a data visualmente (IHC)
  function formatarDataVisivel(dataString) {
    const data = new Date(dataString);
    const hoje = new Date();
    
    const ehHoje = data.getDate() === hoje.getDate() && 
                   data.getMonth() === hoje.getMonth() && 
                   data.getFullYear() === hoje.getFullYear();

    const horaFormatada = data.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
    
    if (ehHoje) return `Hoje, ${horaFormatada}`;
    return `${data.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' })} às ${horaFormatada}`;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erro ao deslogar:", error);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="pedidos-page">
      <header className="top-header">
        <div className="logo-container">
          <div className="logo-badge">VF</div>
          <div className="logo-text-wrap">
            <span className="logo-text">
              Vitrine<span className="text-orange">Fácil</span>
            </span>
            <span className="logo-subtext">Histórico de pedidos</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-btn"><Bell size={20} /></button>
          <button className="icon-btn text-red"><Printer size={20} /></button>
          <button className="icon-btn"><Settings size={20} /></button>
          <div
            className="user-avatar"
            onClick={() => setShowMenu(!showMenu)}
            style={{ cursor: "pointer", position: "relative" }}
          >
            {userInitials}
            {showMenu && (
              <div
                className="context-menu"
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  zIndex: 1000,
                  minWidth: "150px",
                }}
              >
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px 16px",
                    textAlign: "left",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#374151",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pedidos-content">
        <section className="pedidos-header-section">
          <h1 className="page-title">Histórico de Vendas</h1>
          
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar pelo nome do cliente..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {/* Filtros Rápidos (Chips) focados em IHC */}
          <div className="filtros-rapidos">
            <button 
              className={`chip-filtro ${filtroStatus === "Todos" ? "ativo" : ""}`}
              onClick={() => setFiltroStatus("Todos")}
            >
              Todos
            </button>
            <button 
              className={`chip-filtro pendente ${filtroStatus === "Pendente" ? "ativo" : ""}`}
              onClick={() => setFiltroStatus("Pendente")}
            >
              <Clock size={16} /> Pendentes
            </button>
            <button 
              className={`chip-filtro concluido ${filtroStatus === "Concluído" ? "ativo" : ""}`}
              onClick={() => setFiltroStatus("Concluído")}
            >
              <CheckCircle size={16} /> Concluídos
            </button>
          </div>
        </section>

        <section className="pedidos-lista">
          {pedidosFiltrados.length === 0 ? (
            <div className="empty-state">
              <Package size={48} className="empty-icon" />
              <p>Nenhum pedido encontrado aqui.</p>
            </div>
          ) : (
            pedidosFiltrados.map((pedido) => {
              const status = pedido.status || "Pendente";
              const isConcluido = status === "Concluído";
              const qtdTotalItens = pedido.itens.reduce((acc, item) => acc + item.qtd, 0);

              return (
                <div key={pedido.id} className={`pedido-card ${isConcluido ? "card-concluido" : "card-pendente"}`}>
                  <div className="pedido-cabecalho">
                    <div className="pedido-data-cliente">
                      <span className="pedido-data">{formatarDataVisivel(pedido.data)}</span>
                      <div className="pedido-cliente">
                        <User size={16} /> 
                        <strong>{pedido.cliente?.nome || "Cliente Balcão"}</strong>
                      </div>
                    </div>
                    <div className="pedido-total">
                      R$ {pedido.total.toFixed(2).replace(".", ",")}
                    </div>
                  </div>

                  <div className="pedido-resumo">
                    <span className="resumo-texto">
                      {qtdTotalItens} {qtdTotalItens === 1 ? "item" : "itens"} na compra
                    </span>
                    <button className="btn-ver-detalhes">
                      Detalhes <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Ação principal em destaque */}
                  <div className="pedido-acoes">
                    <div className={`status-badge ${isConcluido ? "status-verde" : "status-laranja"}`}>
                      {isConcluido ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {status}
                    </div>

                    {!isConcluido && (
                      <button 
                        className="btn-concluir"
                        onClick={() => marcarComoConcluido(pedido)}
                      >
                        Marcar como Concluído
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      <button
        className="floating-add-btn"
        type="button"
        onClick={() => navigate("/caixa")}
        aria-label="Nova venda"
      >
        <Plus size={18} />
        <span>Nova venda</span>
      </button>

      <nav className="bottom-nav">
        <button className="nav-item" type="button" onClick={() => navigate("/dashboard")}><div className="nav-icon-wrap"><LayoutDashboard size={22} /></div><span>Início</span></button>
        {/* ACTIVE AQUI NOS PEDIDOS */}
        <button className="nav-item active" type="button" onClick={() => navigate("/pedidos")}><div className="nav-icon-wrap"><QrCode size={22} /></div><span>Pedidos</span></button>
        <button className="nav-item" type="button" onClick={() => navigate("/estoque")}><div className="nav-icon-wrap"><Package size={22} /></div><span>Estoque</span></button>
        <button className="nav-item" type="button" onClick={() => navigate("/caixa")}><div className="nav-icon-wrap"><Store size={22} /></div><span>Caixa</span></button>
      </nav>
    </div>
  );
}