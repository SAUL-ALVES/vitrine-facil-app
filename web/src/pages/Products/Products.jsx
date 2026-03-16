import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api.js";
import { uploadProdutoImagem } from "../../services/storage.js";
import "./Products.css";

const PLACEHOLDER_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
  <rect width="100%" height="100%" fill="#f1f5f9"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="24" fill="#64748b">
    Sem imagem
  </text>
</svg>
`)}`;

function toNumber(value) {
  return Number(String(value || "").replace(",", ".")) || 0;
}

function getImageSrc(src) {
  if (!src || typeof src !== "string" || !src.trim()) {
    return PLACEHOLDER_IMG;
  }
  return src;
}

function formatPrice(v) {
  const n = Number(v || 0);
  return n.toFixed(2).replace(".", ",");
}

function ProductEditModal({
  open,
  product,
  onClose,
  onSubmit,
}) {
  const fileInputRef = useRef(null);

  const [nome, setNome] = useState("");
  const [sku, setSku] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [custo, setCusto] = useState("");
  const [estoque, setEstoque] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!open || !product) return;

    setNome(product.nome || "");
    setSku(product.sku || "");
    setDescricao(product.descricao || "");
    setPreco(String(product.preco ?? ""));
    setCusto(String(product.custo ?? ""));
    setEstoque(String(product.estoque ?? 0));
    setMin(String(product.min ?? 0));
    setMax(String(product.max ?? 0));
    setPreview(product.imagem || "");
    setImageFile(null);
    setLocalError("");
  }, [open, product]);

  function onPickImage(file) {
    setLocalError("");

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!file.type?.startsWith("image/")) {
      setLocalError("Selecione um arquivo de imagem válido.");
      setImageFile(null);
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!nome.trim()) {
      setLocalError("Informe o nome do produto.");
      return;
    }

    if (preco === "") {
      setLocalError("Informe o preço de venda.");
      return;
    }

    if (custo === "") {
      setLocalError("Informe o preço de custo.");
      return;
    }

    onSubmit({
      ...product,
      nome: nome.trim(),
      sku: sku.trim(),
      descricao: descricao.trim(),
      preco: toNumber(preco),
      custo: toNumber(custo),
      estoque: Number(estoque || 0),
      min: Number(min || 0),
      max: Number(max || 0),
      imagem: preview || product?.imagem || PLACEHOLDER_IMG,
      imageFile,
    });
  }

  if (!open || !product) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 760,
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>
              Editar Produto
            </h2>
            <p style={{ margin: "6px 0 0", color: "#64748b" }}>
              Atualize as informações do produto
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: 26,
              cursor: "pointer",
              lineHeight: 1,
              color: "#475569",
            }}
          >
            ×
          </button>
        </div>

        {localError ? (
          <div className="products-alert products-alert-error">{localError}</div>
        ) : null}

        <form className="products-form" onSubmit={handleSubmit}>
          <div className="products-grid-2">
            <label className="products-label">
              <span>Nome</span>
              <input
                className="products-input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do produto"
              />
            </label>

            <label className="products-label">
              <span>SKU</span>
              <input
                className="products-input"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SKU do produto"
              />
            </label>
          </div>

          <label className="products-label">
            <span>Descrição</span>
            <textarea
              className="products-textarea"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o produto"
            />
          </label>

          <div className="products-grid-2">
            <label className="products-label">
              <span>Venda (R$)</span>
              <input
                className="products-input"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="0,00"
              />
            </label>

            <label className="products-label">
              <span>Custo (R$)</span>
              <input
                className="products-input"
                value={custo}
                onChange={(e) => setCusto(e.target.value)}
                placeholder="0,00"
              />
            </label>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <label className="products-label">
              <span>Estoque Atual</span>
              <input
                className="products-input"
                type="number"
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
                placeholder="0"
              />
            </label>

            <label className="products-label">
              <span>Estoque Mínimo</span>
              <input
                className="products-input"
                type="number"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                placeholder="0"
              />
            </label>

            <label className="products-label">
              <span>Estoque Máximo</span>
              <input
                className="products-input"
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                placeholder="0"
              />
            </label>
          </div>

          <div className="upload-row">
            <div className="upload-preview">
              <img
                src={getImageSrc(preview)}
                alt="Prévia do produto"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_IMG;
                }}
              />
            </div>

            <div className="upload-box">
              <input
                ref={fileInputRef}
                className="upload-input"
                type="file"
                accept="image/*"
                onChange={(e) => onPickImage(e.target.files?.[0])}
                id="editar-produto-imagem"
              />

              <label htmlFor="editar-produto-imagem" className="upload-label">
                <div className="upload-plus">+</div>
                <div className="upload-text">
                  <b>Trocar imagem</b>
                  <small>PNG, JPG ou JPEG</small>
                </div>
              </label>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 20,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              className="products-secondary-btn"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button className="products-primary-btn" type="submit">
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Products() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.idUsuario || user?.id || user?.sub || null;

  const [produtos, setProdutos] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [nome, setNome] = useState("");
  const [sku, setSku] = useState("");
  const [preco, setPreco] = useState("");
  const [custo, setCusto] = useState("");
  const [estoque, setEstoque] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function carregarProdutosAtualizados() {
    try {
      if (!userId) {
        setProdutos([]);
        return;
      }

      const data = await api.getProdutos(userId);
      setProdutos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar os produtos.");
      setProdutos([]);
    }
  }

  useEffect(() => {
    carregarProdutosAtualizados();
  }, [userId]);

  function onPickImage(file) {
    setError("");
    setOk("");

    if (!file) {
      setImageFile(null);
      setImgUrl("");
      return;
    }

    if (!file.type?.startsWith("image/")) {
      setImageFile(null);
      setImgUrl("");
      setError("Selecione um arquivo de imagem válido.");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImgUrl(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  }

  function validate() {
    if (!userId) return "Faça login novamente.";
    if (!nome.trim()) return "Informe o nome.";
    if (!preco) return "Informe o preço.";
    if (!custo) return "Informe o custo.";
    return "";
  }

  async function addProduto(e) {
    e.preventDefault();
    setError("");
    setOk("");

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      let imagemFinal = PLACEHOLDER_IMG;

      if (imageFile) {
        const uploadUrl = await uploadProdutoImagem(imageFile, userId);
        if (uploadUrl && typeof uploadUrl === "string") {
          imagemFinal = uploadUrl;
        }
      }

      const novo = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        userId,
        nome: nome.trim(),
        sku: sku.trim() || `SKU-${String(Date.now()).slice(-6)}`,
        categoria: "Sem categoria",
        fornecedor: "Não informado",
        preco: toNumber(preco),
        custo: toNumber(custo),
        estoque: Number(estoque || 0),
        min: Number(min || 0),
        max: Number(max || 0),
        descricao: descricao.trim(),
        imagem: imagemFinal,
        createdAt: Date.now(),
      };

      await api.addProduto(novo);
      await carregarProdutosAtualizados();

      setNome("");
      setSku("");
      setPreco("");
      setCusto("");
      setEstoque("");
      setMin("");
      setMax("");
      setDescricao("");
      setImgUrl("");
      setImageFile(null);
      setOk("Produto salvo com sucesso!");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Erro ao salvar o produto.");
    }
  }

  async function salvarEdicao(produtoAtualizado) {
    setError("");
    setOk("");

    try {
      let imagemFinal = produtoAtualizado.imagem || PLACEHOLDER_IMG;

      if (produtoAtualizado.imageFile) {
        const uploadUrl = await uploadProdutoImagem(
          produtoAtualizado.imageFile,
          userId
        );
        if (uploadUrl && typeof uploadUrl === "string") {
          imagemFinal = uploadUrl;
        }
      }

      const payload = {
        ...produtoAtualizado,
        imagem: imagemFinal,
      };

      delete payload.imageFile;

      await api.updateProduto(produtoAtualizado.id, payload);
      await carregarProdutosAtualizados();

      setModalOpen(false);
      setEditingProduct(null);
      setOk("Produto atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Erro ao atualizar o produto.");
    }
  }

  async function remover(id) {
    try {
      await api.deleteProduto(id);
      await carregarProdutosAtualizados();
    } catch (err) {
      console.error(err);
      setError("Erro ao remover o produto.");
    }
  }

  function abrirEdicao(produto) {
    setEditingProduct(produto);
    setModalOpen(true);
    setError("");
    setOk("");
  }

  function fecharEdicao() {
    setEditingProduct(null);
    setModalOpen(false);
  }

  return (
    <div className="products-page">
      <div className="products-center">
        <div className="products-card">
          <h1 className="products-title">Cadastrar produtos</h1>
          <p className="products-subtitle">
            Preencha os dados completos do produto para integrar com o estoque.
          </p>

          {error ? (
            <div className="products-alert products-alert-error">{error}</div>
          ) : null}

          {ok ? (
            <div className="products-alert products-alert-success">{ok}</div>
          ) : null}

          <form className="products-form" onSubmit={addProduto}>
            <div className="products-grid-2">
              <label className="products-label">
                <span>Nome</span>
                <input
                  className="products-input"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do produto"
                />
              </label>

              <label className="products-label">
                <span>SKU</span>
                <input
                  className="products-input"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="SKU do produto"
                />
              </label>
            </div>

            <label className="products-label">
              <span>Descrição</span>
              <textarea
                className="products-textarea"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o produto"
              />
            </label>

            <div className="products-grid-2">
              <label className="products-label">
                <span>Venda (R$)</span>
                <input
                  className="products-input"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="0,00"
                />
              </label>

              <label className="products-label">
                <span>Custo (R$)</span>
                <input
                  className="products-input"
                  value={custo}
                  onChange={(e) => setCusto(e.target.value)}
                  placeholder="0,00"
                />
              </label>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 12,
                marginBottom: 18,
              }}
            >
              <label className="products-label">
                <span>Estoque Atual</span>
                <input
                  className="products-input"
                  type="number"
                  value={estoque}
                  onChange={(e) => setEstoque(e.target.value)}
                  placeholder="0"
                />
              </label>

              <label className="products-label">
                <span>Estoque Mínimo</span>
                <input
                  className="products-input"
                  type="number"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  placeholder="0"
                />
              </label>

              <label className="products-label">
                <span>Estoque Máximo</span>
                <input
                  className="products-input"
                  type="number"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  placeholder="0"
                />
              </label>
            </div>

            <div className="upload-row">
              <div className="upload-preview">
                <img
                  src={imgUrl || PLACEHOLDER_IMG}
                  alt="Prévia do produto"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_IMG;
                  }}
                />
              </div>

              <div className="upload-box">
                <input
                  id="produto-imagem"
                  className="upload-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickImage(e.target.files?.[0])}
                />

                <label htmlFor="produto-imagem" className="upload-label">
                  <div className="upload-plus">+</div>
                  <div className="upload-text">
                    <b>Escolher imagem</b>
                    <small>PNG, JPG ou JPEG</small>
                  </div>
                </label>
              </div>
            </div>

            <div className="products-actions">
              <button className="products-primary-btn" type="submit">
                Salvar produto
              </button>

              <button
                type="button"
                className="products-secondary-btn"
                onClick={() => navigate("/dashboard")}
              >
                Pular por enquanto
              </button>
            </div>
          </form>

          <div className="products-list-wrap">
            {produtos.length === 0 ? (
              <p className="products-empty">Nenhum produto cadastrado ainda.</p>
            ) : (
              produtos.map((p) => (
                <div key={p.id} className="product-mini-card">
                  <div className="product-mini-thumb">
                    <img
                      src={getImageSrc(p.imagem)}
                      alt={p.nome || "Produto"}
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMG;
                      }}
                    />
                  </div>

                  <div className="product-mini-info">
                    <div className="product-mini-name">{p.nome}</div>

                    {p.descricao ? (
                      <div className="product-mini-desc">{p.descricao}</div>
                    ) : null}

                    <div className="product-mini-meta">
                      SKU: {p.sku || "Sem SKU"} | Estoque: {Number(p.estoque || 0)}
                    </div>

                    <div className="product-mini-meta">
                      Mín: {Number(p.min || 0)} | Máx: {Number(p.max || 0)}
                    </div>

                    <div className="product-mini-price">
                      Venda: R$ {formatPrice(p.preco)} | Custo: R$ {formatPrice(p.custo)}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      alignItems: "stretch",
                    }}
                  >
                    <button
                      type="button"
                      className="products-secondary-btn"
                      onClick={() => abrirEdicao(p)}
                      style={{ minWidth: 110 }}
                    >
                      Editar
                    </button>

                    <button
                      className="product-mini-remove"
                      onClick={() => remover(p.id)}
                      type="button"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ProductEditModal
        open={modalOpen}
        product={editingProduct}
        onClose={fecharEdicao}
        onSubmit={salvarEdicao}
      />
    </div>
  );
}