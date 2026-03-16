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
  const { user } = useAuth();
  const userId = user?.idUsuario || user?.id || user?.sub || null;

  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [carrinho, setCarrinho] = useState([]);
  const [nomeCliente, setNomeCliente] = useState("");
  const [telefoneCliente, setTelefoneCliente] = useState("");

  useEffect(() => {
    async function load() {
      const data = await api.getProdutos(userId);
      setProdutos(data);
    }

    load();
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
    if (produto.estoque <= 0) {
      alert("Produto sem estoque!");
      return;
    }

    setCarrinho((prev) => {
      const existe = prev.find((item) => item.id === produto.id);
      if (existe) {
        if (existe.qtd >= produto.estoque) {
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
      prev.map((item) => {
        if (item.id === id) {
          const prodDb = produtos.find((p) => p.id === id);
          const novaQtd = item.qtd + delta;
          if (novaQtd > (prodDb?.estoque || 0)) {
            alert("Estoque máximo atingido!");
            return item;
          }
          return novaQtd > 0 ? { ...item, qtd: novaQtd } : item;
        }
        return item;
      })
    );
  }

  function removerDoCarrinho(id) {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  }

  const totalCarrinho = carrinho.reduce((acc, item) => acc + item.preco * item.qtd, 0);

  async function finalizarVenda() {
    if (carrinho.length === 0) return;

    try {
      await api.finalizarVenda({
        userId,
        carrinho,
        nomeCliente,
        telefoneCliente,
        totalCarrinho,
      });

      alert(`Venda finalizada!\nTotal: R$ ${totalCarrinho.toFixed(2).replace(".", ",")}`);

      setCarrinho([]);
      setNomeCliente("");
      setTelefoneCliente("");
      const atualizados = await api.getProdutos(userId);
      setProdutos(atualizados);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Erro ao finalizar venda no Firebase.");
    }
  }

  return (
    <div className="caixa-page">
      <header className="top-header">
        <div className="logo-container">
          <div className="logo-badge">VF</div>
          <span className="logo-text">
            Vitrine<span className="text-orange">Fácil</span>
          </span>
        </div>
        <div className="header-actions">
          <button className="icon-btn">
            <Bell size={20} />
          </button>
          <button className="icon-btn text-red">
            <Printer size={20} />
          </button>
          <button className="icon-btn">
            <Settings size={20} />
          </button>
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
                    className="produto-card"
                    onClick={() => adicionarAoCarrinho(p)}
                    disabled={p.estoque <= 0}
                    style={{ opacity: p.estoque <= 0 ? 0.5 : 1 }}
                  >
                    {qtdCarrinho > 0 && <span className="produto-badge-qtd">{qtdCarrinho}</span>}

                    <img src={p.imagem || PLACEHOLDER_IMG} alt={p.nome} className="produto-img" />
                    <h3 className="produto-nome">{p.nome}</h3>
                    <strong className="produto-preco">
                      R$ {Number(p.preco).toFixed(2).replace(".", ",")}
                    </strong>
                    <span
                      className="produto-estoque"
                      style={{ color: p.estoque <= 0 ? "var(--vf-red)" : "inherit" }}
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
              <ShoppingCart size={20} /> Carrinho ({carrinho.reduce((a, b) => a + b.qtd, 0)})
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
                      <span>R$ {(item.preco * item.qtd).toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div className="item-controls">
                      <button onClick={() => alterarQuantidade(item.id, -1)}>
                        <Minus size={14} />
                      </button>
                      <span>{item.qtd}</span>
                      <button onClick={() => alterarQuantidade(item.id, 1)}>
                        <Plus size={14} />
                      </button>
                      <button className="btn-lixeira" onClick={() => removerDoCarrinho(item.id)}>
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
                <button className="btn-finalizar" onClick={finalizarVenda}>
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