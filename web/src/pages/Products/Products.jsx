import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api.js";
import "./Products.css";

const PLACEHOLDER_IMG = "https://placehold.net/600x400.png";

export default function Products() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.idUsuario || user?.id || user?.sub || "anon";

  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function carregar() {
      const data = await api.getProdutos(userId);
      setProdutos(data);
    }
    carregar();
  }, [userId]);

  const [nome, setNome] = useState("");
  const [sku, setSku] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [preco, setPreco] = useState("");
  const [custo, setCusto] = useState("");
  const [estoque, setEstoque] = useState("");
  const [minimo, setMinimo] = useState("");
  const [maximo, setMaximo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  function onPickImage(file) {
    setError("");
    setOk("");
    if (!file) return;
    if (!file.type?.startsWith("image/")) {
      setError("Selecione uma imagem.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImgUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  function validate() {
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
    if (msg) return setError(msg);

    const novo = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      userId, // <-- IMPORTANTE
      nome: nome.trim(),
      sku: sku.trim() || `SKU-${String(Date.now()).slice(-6)}`,
      categoria: categoria.trim() || "Sem categoria",
      fornecedor: fornecedor.trim() || "Não informado",
      preco: Number(String(preco).replace(",", ".")),
      custo: Number(String(custo).replace(",", ".")),
      estoque: Number(estoque || 0),
      min: Number(minimo || 0),
      max: Number(maximo || 0),
      descricao: descricao.trim(),
      imagem: imgUrl || PLACEHOLDER_IMG,
      createdAt: Date.now(),
    };

    try {
      await api.addProduto(novo);
      const data = await api.getProdutos(userId);
      setProdutos(data);

      // Limpar formulário
      setNome("");
      setSku("");
      setCategoria("");
      setFornecedor("");
      setPreco("");
      setCusto("");
      setEstoque("");
      setMinimo("");
      setMaximo("");
      setDescricao("");
      setImgUrl("");
      setOk("Produto salvo no banco de dados!");
    } catch (err) {
      setError("Erro ao salvar o produto na API.");
    }
  }

  async function remover(id) {
    await api.deleteProduto(id);
    const data = await api.getProdutos(userId);
    setProdutos(data);
  }

  function formatPrice(v) {
    return Number(v).toFixed(2).replace(".", ",");
  }

  return (
    <div className="products-page">
      <div className="products-center">
        <div className="products-card">
          <h1 className="products-title">Cadastrar produtos</h1>
          <p className="products-subtitle">
            Preencha os dados completos do produto para integrar com o estoque.
          </p>

          {error && (
            <div className="products-alert products-alert-error">{error}</div>
          )}
          {ok && (
            <div className="products-alert products-alert-success">{ok}</div>
          )}

          <form className="products-form" onSubmit={addProduto}>
            <div className="products-grid-2">
              <label className="products-label">
                <span>Nome</span>
                <input
                  className="products-input"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </label>
              <label className="products-label">
                <span>SKU</span>
                <input
                  className="products-input"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </label>
            </div>

            <label className="products-label">
              <span>Descrição</span>
              <input
                className="products-input"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </label>

            <div className="products-grid-2">
              <label className="products-label">
                <span>Venda (R$)</span>
                <input
                  className="products-input"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                />
              </label>
              <label className="products-label">
                <span>Custo (R$)</span>
                <input
                  className="products-input"
                  value={custo}
                  onChange={(e) => setCusto(e.target.value)}
                />
              </label>
            </div>

            <div className="products-stock-block">
              <div className="products-stock-title">Estoque Atual</div>
              <input
                className="products-input"
                type="number"
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
              />
            </div>

            <div className="upload-row">
              <div className="upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickImage(e.target.files?.[0])}
                />
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
            {produtos.map((p) => (
              <div
                key={p.id}
                className="product-mini-card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div>
                  <strong>{p.nome}</strong>
                  <div>
                    R$ {formatPrice(p.preco)} | Estoque: {p.estoque}
                  </div>
                </div>
                <button
                  onClick={() => remover(p.id)}
                  style={{
                    color: "red",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
