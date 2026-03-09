import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { api } from "../../services/api.js";
import {
  Bell,
  Printer,
  Settings,
  Search,
  Plus,
  Package,
  LayoutDashboard,
  QrCode,
  Store,
  Pencil,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import "./Estoque.css";

const PLACEHOLDER_IMG = "https://placehold.net/600x400.png";

const brl = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(v || 0)
  );

function getStockStatus(prod) {
  if (Number(prod.estoque) <= 0) return "sem";
  if (Number(prod.estoque) < Number(prod.min || 0)) return "baixo";
  return "ok";
}

// ... Manter o componente <ProductModal> idêntico ao que você me enviou ...
function ProductModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
  mode = "create",
}) {
  // (Cole aqui o conteúdo original da função ProductModal sem alterações)
  const fileInputRef = useRef(null);

  const emptyForm = {
    id: null,
    nome: "",
    sku: "",
    descricao: "",
    categoria: "",
    fornecedor: "",
    preco: "",
    custo: "",
    estoque: "",
    min: "",
    max: "",
    imagem: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [selectedImageName, setSelectedImageName] = useState("");

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      setForm({
        id: initialData.id ?? null,
        nome: initialData.nome ?? "",
        sku: initialData.sku ?? "",
        descricao: initialData.descricao ?? "",
        categoria: initialData.categoria ?? "",
        fornecedor: initialData.fornecedor ?? "",
        preco: String(initialData.preco ?? ""),
        custo: String(initialData.custo ?? ""),
        estoque: String(initialData.estoque ?? 0),
        min: String(initialData.min ?? 0),
        max: String(initialData.max ?? 0),
        imagem: initialData.imagem ?? "",
      });
      setSelectedImageName("");
    } else {
      setForm(emptyForm);
      setSelectedImageName("");
    }
  }, [open, initialData]);

  const canSubmit = useMemo(
    () =>
      form.nome.trim().length > 0 &&
      form.preco !== "" &&
      form.custo !== "" &&
      Number(form.preco) >= 0 &&
      Number(form.custo) >= 0,
    [form]
  );

  if (!open) return null;

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      ...form,
      categoria: form.categoria?.trim() || "Sem categoria",
      fornecedor: form.fornecedor?.trim() || "Não informado",
      preco: Number(form.preco || 0),
      custo: Number(form.custo || 0),
      estoque: Number(form.estoque || 0),
      min: Number(form.min || 0),
      max: Number(form.max || 0),
      imagem: form.imagem || PLACEHOLDER_IMG,
    });
  }

  function onPickImage(file) {
    if (!file) return;
    if (!file.type?.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setField("imagem", String(reader.result || ""));
      setSelectedImageName(file.name || "imagem selecionada");
    };
    reader.readAsDataURL(file);
  }

  const title = mode === "edit" ? "Editar Produto" : "Adicionar Novo Produto";
  const subtitle =
    mode === "edit"
      ? "Atualize as informações do produto"
      : "Adicione um novo produto ao seu estoque";
  const submitLabel =
    mode === "edit" ? "Salvar Alterações" : "Adicionar Produto";

  const hasCurrentImage = !!form.imagem;
  const imageStatusText = selectedImageName
    ? `Nova imagem selecionada: ${selectedImageName}`
    : hasCurrentImage
    ? "Imagem atual carregada"
    : "Nenhuma imagem selecionada";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
          <button className="icon-close" type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="grid-2">
            <label>
              <span>Nome do Produto</span>
              <input
                autoFocus
                value={form.nome}
                onChange={(e) => setField("nome", e.target.value)}
                placeholder="Ex: Café"
                required
              />
            </label>
            <label>
              <span>
                SKU <small>(opcional)</small>
              </span>
              <input
                value={form.sku}
                onChange={(e) => setField("sku", e.target.value)}
              />
            </label>
          </div>
          <label>
            <span>Descrição</span>
            <textarea
              rows={3}
              value={form.descricao}
              onChange={(e) => setField("descricao", e.target.value)}
            />
          </label>
          <div className="grid-2">
            <label>
              <span>Categoria</span>
              <input
                value={form.categoria}
                onChange={(e) => setField("categoria", e.target.value)}
              />
            </label>
            <label>
              <span>Fornecedor</span>
              <input
                value={form.fornecedor}
                onChange={(e) => setField("fornecedor", e.target.value)}
              />
            </label>
          </div>
          <div className="grid-2">
            <label>
              <span>Preço de Venda (R$)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.preco}
                onChange={(e) => setField("preco", e.target.value)}
                required
              />
            </label>
            <label>
              <span>Preço de Custo (R$)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.custo}
                onChange={(e) => setField("custo", e.target.value)}
                required
              />
            </label>
          </div>
          <div className="stock-group-title">Regras de Estoque</div>
          <div className="grid-3">
            <label>
              <span>Estoque Atual</span>
              <input
                type="number"
                min="0"
                step="1"
                value={form.estoque}
                onChange={(e) => setField("estoque", e.target.value)}
              />
            </label>
            <label>
              <span>Mínimo</span>
              <input
                type="number"
                min="0"
                step="1"
                value={form.min}
                onChange={(e) => setField("min", e.target.value)}
              />
            </label>
            <label>
              <span>Máximo</span>
              <input
                type="number"
                min="0"
                step="1"
                value={form.max}
                onChange={(e) => setField("max", e.target.value)}
              />
            </label>
          </div>
          <label>
            <span>Imagem do Produto</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => onPickImage(e.target.files?.[0])}
              style={{ display: "none" }}
            />
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                background: "#fff",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "1px solid #d1d5db",
                  background: "#f9fafb",
                  color: "#111827",
                  borderRadius: 10,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {hasCurrentImage
                  ? "Gostaria de trocar a imagem?"
                  : "Selecionar imagem"}
              </button>
              <span
                style={{
                  fontSize: 13,
                  color: selectedImageName ? "#0f766e" : "#6b7280",
                  fontWeight: selectedImageName ? 700 : 500,
                  textAlign: "right",
                  flex: 1,
                  minWidth: 180,
                }}
              >
                {imageStatusText}
              </span>
            </div>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={!canSubmit}>
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Estoque() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.idUsuario || user?.id || user?.sub || "anon";

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [nivel, setNivel] = useState("Todos");
  const [ordenacao, setOrdenacao] = useState("nome");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  async function carregarProdutos() {
    try {
      const data = await api.getProdutos(userId);
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, [userId]);

  const categorias = useMemo(
    () => ["Todas", ...Array.from(new Set(products.map((p) => p.categoria)))],
    [products]
  );
  const stats = useMemo(() => {
    return {
      total: products.length,
      valorEstoque: products.reduce(
        (acc, p) => acc + Number(p.estoque || 0) * Number(p.custo || 0),
        0
      ),
      baixo: products.filter((p) => getStockStatus(p) === "baixo").length,
      sem: products.filter((p) => getStockStatus(p) === "sem").length,
    };
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          (p.nome || "").toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q)
      );
    }
    if (categoria !== "Todas")
      list = list.filter((p) => p.categoria === categoria);
    if (nivel !== "Todos") {
      list = list.filter((p) => {
        const s = getStockStatus(p);
        if (nivel === "Em estoque") return s === "ok";
        if (nivel === "Estoque baixo") return s === "baixo";
        if (nivel === "Sem estoque") return s === "sem";
        return true;
      });
    }
    if (ordenacao === "nome") list.sort((a, b) => a.nome.localeCompare(b.nome));
    else if (ordenacao === "estoque")
      list.sort((a, b) => Number(a.estoque || 0) - Number(b.estoque || 0));
    return list;
  }, [products, query, categoria, nivel, ordenacao]);

  async function handleCreateOrUpdateProduct(formProduct) {
    try {
      if (editingProduct) {
        await api.updateProduto(editingProduct.id, {
          ...editingProduct,
          ...formProduct,
        });
      } else {
        const safeSku =
          (formProduct.sku || "").trim() ||
          `SKU-${String(Date.now()).slice(-6)}`;
        await api.addProduto({
          ...formProduct,
          id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
          sku: safeSku,
          userId, // MUITO IMPORTANTE: Salvar quem é o dono do produto
          createdAt: Date.now(),
        });
      }
      await carregarProdutos(); // Recarrega da API
      setModalOpen(false);
    } catch (e) {
      alert("Erro ao salvar o produto");
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Deseja realmente excluir este produto?")) {
      await api.deleteProduto(id);
      await carregarProdutos();
    }
  }

  function handleOpenCreate() {
    setEditingProduct(null);
    setModalOpen(true);
  }
  function handleOpenEdit(product) {
    setEditingProduct(product);
    setModalOpen(true);
  }
  function handleCloseModal() {
    setModalOpen(false);
    setEditingProduct(null);
  }

  return (
    <div className="estoque-page">
      <header className="estoque-topbar">
        <div className="estoque-brand">
          <div className="estoque-brand-badge">VF</div>
          <span className="estoque-brand-name">VitrineFácil</span>
        </div>
      </header>
      <main className="estoque-content">
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Produtos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value value-money">
              {brl(stats.valorEstoque)}
            </div>
            <div className="stat-label">Valor em estoque</div>
          </div>
          <div className="stat-card">
            <div className="stat-value value-warning">{stats.baixo}</div>
            <div className="stat-label">Baixo estoque</div>
          </div>
          <div className="stat-card">
            <div className="stat-value value-danger">{stats.sem}</div>
            <div className="stat-label">Sem estoque</div>
          </div>
        </section>

        <section className="filters-card">
          <div className="filters-header">
            <div className="filters-title-wrap">
              <Search size={20} />
              <h2>Busca e Filtros</h2>
            </div>
            <button
              className="primary-btn"
              type="button"
              onClick={handleOpenCreate}
            >
              <Plus size={18} /> Adicionar Produto
            </button>
          </div>
          <div className="filters-body">
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou SKU..."
              />
            </div>
          </div>
        </section>

        <section className="products-section">
          <h2 className="products-title">Produtos ({filtered.length})</h2>
          <div className="products-list">
            {filtered.length === 0 ? (
              <div className="empty-stock-state">
                <h3>Nenhum produto encontrado</h3>
              </div>
            ) : (
              filtered.map((p) => {
                const status = getStockStatus(p);
                const margem =
                  p.preco > 0 ? ((p.preco - p.custo) / p.preco) * 100 : 0;
                return (
                  <article
                    key={p.id}
                    className={`product-card stock-${status}`}
                  >
                    <div className="product-main">
                      <div className="product-main-row">
                        <div className="product-thumb">
                          <img src={p.imagem || PLACEHOLDER_IMG} alt={p.nome} />
                        </div>
                        <div className="product-main-text">
                          <h3 className="product-name">{p.nome}</h3>
                          <p className="product-sku">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </div>
                    <div className="product-grid">
                      <div className="product-cell">
                        <span className="cell-label">Estoque</span>
                        <strong>{p.estoque} unidade</strong>
                      </div>
                      <div className="product-cell">
                        <span className="cell-label">Preço</span>
                        <strong>{brl(p.preco)}</strong>
                      </div>
                      <div className="product-cell">
                        <span className="cell-label">Custo</span>
                        <strong>{brl(p.custo)}</strong>
                      </div>
                      <div className="product-cell">
                        <span className="cell-label">Margem</span>
                        <strong className="margem-value">
                          {margem.toFixed(1)}%
                        </strong>
                      </div>
                    </div>
                    <div className="product-side">
                      <div className="product-actions">
                        <button
                          className="btn-outline"
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                        >
                          <Pencil size={16} /> Editar
                        </button>
                        <button
                          className="btn-outline-danger"
                          type="button"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 size={16} /> Excluir
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
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
          className="nav-item active"
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

      <ProductModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrUpdateProduct}
        initialData={editingProduct}
        mode={editingProduct ? "edit" : "create"}
      />
    </div>
  );
}
