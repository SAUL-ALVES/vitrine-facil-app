import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { api } from "../../services/api.js";
import {
  Search,
  ShoppingCart,
  User,
  Bell,
  Printer,
  Settings,
  LayoutDashboard,
  QrCode,
  Package,
  Store,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import "./Caixa.css";

const PLACEHOLDER_IMG = "https://placehold.net/600x400.png";

export default function Caixa() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userId = user?.idUsuario || user?.id || user?.sub || null;
  const userInitials = user?.nome ? user.nome.substring(0, 2).toUpperCase() : "VF";
  const [showMenu, setShowMenu] = useState(false);

  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [carrinho, setCarrinho] = useState([]);
  const [nomeCliente, setNomeCliente] = useState("");
  const [telefoneCliente, setTelefoneCliente] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getProdutos(userId);
        setProdutos(data || []);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    }

    if (userId) {
      load();
    }
  }, [userId]);

  const categorias = useMemo(() => {
    const cats = new Set(produtos.map((p) => p.categoria || "Sem categoria"));
    return ["Todos", ...Array.from(cats)];
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const matchBusca = (p.nome || "").toLowerCase().includes(busca.toLowerCase());
      const matchCat =
        categoriaAtiva === "Todos" ||
        (p.categoria || "Sem categoria") === categoriaAtiva;
      return matchBusca && matchCat;
    });
  }, [produtos, busca, categoriaAtiva]);

  function adicionarAoCarrinho(produto) {
    if ((produto.estoque || 0) <= 0) {
      alert("Produto sem estoque!");
      return;
    }

    setCarrinho((prev) => {
      const existe = prev.find((item) => item.id === produto.id);

      if (existe) {
        if (existe.qtd >= (produto.estoque || 0)) {
          alert("Estoque insuficiente!");
          return prev;
        }

        return prev.map((item) =>
          item.id === produto.id ? { ...item, qtd: item.qtd + 1 } : item
        );
      }

      return [...prev, { ...produto, qtd: 1 }];
    });
  }

  function alterarQuantidade(id, delta) {
    setCarrinho((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;

          const prodDb = produtos.find((p) => p.id === id);
          const estoqueMaximo = prodDb?.estoque || 0;
          const novaQtd = item.qtd + delta;

          if (novaQtd > estoqueMaximo) {
            alert("Estoque máximo atingido!");
            return item;
          }

          return { ...item, qtd: novaQtd };
        })
        .filter((item) => item.qtd > 0)
    );
  }

  function removerDoCarrinho(id) {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  }

  const totalCarrinho = carrinho.reduce(
    (acc, item) => acc + Number(item.preco || 0) * Number(item.qtd || 0),
    0
  );

  async function finalizarVenda() {
    if (carrinho.length === 0) {
      alert("Adicione produtos ao carrinho.");
      return;
    }

    try {
      await api.finalizarVenda({
        userId,
        carrinho,
        nomeCliente,
        telefoneCliente,
        totalCarrinho,
        status: "Concluído",
        data: new Date().toISOString(),
      });

      alert(
        `Venda finalizada com sucesso!\nTotal: R$ ${totalCarrinho
          .toFixed(2)
          .replace(".", ",")}`
      );

      setCarrinho([]);
      setNomeCliente("");
      setTelefoneCliente("");

      const atualizados = await api.getProdutos(userId);
      setProdutos(atualizados || []);

      navigate("/pedidos");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Erro ao finalizar venda no Firebase.");
    }
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
    <div className="caixa-page">
      <header className="top-header">
        <div className="logo-container">
          <div className="logo-badge">VF</div>
          <div className="logo-text-wrap">
            <span className="logo-text">
              Vitrine<span className="text-orange">Fácil</span>
            </span>
            <span className="logo-subtext">Caixa</span>
          </div>
        </div>

        <div className="header-actions">
          <button className="icon-btn" type="button">
            <Bell size={20} />
          </button>

          <button className="icon-btn text-red" type="button">
            <Printer size={20} />
          </button>

          <button className="icon-btn" type="button">
            <Settings size={20} />
          </button>

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
                  onClick={() => navigate("/profile")}
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
                  Editar perfil
                </button>
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

      <main className="caixa-content">
        <section className="produtos-section">
          <div className="filtros-container card-panel">
            <div className="search-bar">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar Produtos"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <div className="categorias-chips">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`chip-btn ${categoriaAtiva === cat ? "active" : ""}`}
                  onClick={() => setCategoriaAtiva(cat)}
                >
                  {categoriaAtiva === cat && <LayoutDashboard size={14} />} {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="produtos-grid">
            {produtosFiltrados.length === 0 ? (
              <div className="empty-state">Nenhum produto encontrado.</div>
            ) : (
              produtosFiltrados.map((p) => {
                const itemNoCarrinho = carrinho.find((item) => item.id === p.id);
                const qtdCarrinho = itemNoCarrinho ? itemNoCarrinho.qtd : 0;

                return (
                  <button
                    key={p.id}
                    type="button"
                    className="produto-card"
                    onClick={() => adicionarAoCarrinho(p)}
                    disabled={(p.estoque || 0) <= 0}
                    style={{ opacity: (p.estoque || 0) <= 0 ? 0.5 : 1 }}
                  >
                    {qtdCarrinho > 0 && (
                      <span className="produto-badge-qtd">{qtdCarrinho}</span>
                    )}

                    <img
                      src={p.imagem || PLACEHOLDER_IMG}
                      alt={p.nome}
                      className="produto-img"
                    />

                    <h3 className="produto-nome">{p.nome}</h3>

                    <strong className="produto-preco">
                      R$ {Number(p.preco || 0).toFixed(2).replace(".", ",")}
                    </strong>

                    <span
                      className="produto-estoque"
                      style={{
                        color: (p.estoque || 0) <= 0 ? "var(--vf-red)" : "inherit",
                      }}
                    >
                      Estoque: {p.estoque || 0}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <aside className="checkout-section">
          <div className="carrinho-panel card-panel">
            <h2 className="panel-title">
              <ShoppingCart size={20} /> Carrinho (
              {carrinho.reduce((a, b) => a + (b.qtd || 0), 0)})
            </h2>

            <div className="carrinho-items">
              {carrinho.length === 0 ? (
                <div className="carrinho-vazio">
                  <ShoppingCart size={48} className="icon-vazio" />
                  <p>Carrinho vazio</p>
                </div>
              ) : (
                carrinho.map((item) => (
                  <div key={item.id} className="carrinho-item">
                    <div className="item-info">
                      <h4>{item.nome}</h4>
                      <span>
                        R$ {(Number(item.preco || 0) * Number(item.qtd || 0))
                          .toFixed(2)
                          .replace(".", ",")}
                      </span>
                    </div>

                    <div className="item-controls">
                      <button type="button" onClick={() => alterarQuantidade(item.id, -1)}>
                        <Minus size={14} />
                      </button>

                      <span>{item.qtd}</span>

                      <button type="button" onClick={() => alterarQuantidade(item.id, 1)}>
                        <Plus size={14} />
                      </button>

                      <button
                        type="button"
                        className="btn-lixeira"
                        onClick={() => removerDoCarrinho(item.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {carrinho.length > 0 && (
              <div className="carrinho-footer">
                <div className="total-row">
                  <span>Total</span>
                  <strong>R$ {totalCarrinho.toFixed(2).replace(".", ",")}</strong>
                </div>

                <button className="btn-finalizar" type="button" onClick={finalizarVenda}>
                  Finalizar Venda
                </button>
              </div>
            )}
          </div>

          <div className="cliente-panel card-panel">
            <h2 className="panel-title">
              <User size={20} /> Cliente (Opcional)
            </h2>

            <div className="cliente-form">
              <input
                type="text"
                placeholder="Nome do cliente"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
              />

              <input
                type="tel"
                placeholder="Número de telefone"
                value={telefoneCliente}
                onChange={(e) => setTelefoneCliente(e.target.value)}
              />
            </div>
          </div>
        </aside>
      </main>

      <nav className="bottom-nav">
        <button
          className="nav-item"
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
          className="nav-item active"
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