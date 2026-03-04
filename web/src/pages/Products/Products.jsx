import React, { useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "./Products.css";

const STORE_KEY = "vf_store_profile";
const PRODUCTS_KEY = "vf_products";
const PLACEHOLDER_IMG = "https://placehold.net/600x400.png";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function loadStoreProfile(userId) {
  const raw = localStorage.getItem(STORE_KEY);
  const all = safeParse(raw) || {};
  return all[userId] || null;
}

function loadProducts(userId) {
  const raw = localStorage.getItem(PRODUCTS_KEY);
  const all = safeParse(raw) || {};
  return all[userId] || [];
}

function saveProducts(userId, list) {
  const raw = localStorage.getItem(PRODUCTS_KEY);
  const all = safeParse(raw) || {};
  all[userId] = list;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(all));
}

export default function Products() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.idUsuario || user?.id || user?.sub || "anon";

  const store = useMemo(() => loadStoreProfile(userId), [userId]);
  const [produtos, setProdutos] = useState(() => loadProducts(userId));

  // Form completo (compatível com estoque)
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

  const logoUrl = store?.fotoUrl || PLACEHOLDER_IMG;

  function onPickImage(file) {
    setError("");
    setOk("");

    if (!file) return;
    if (!file.type?.startsWith("image/")) {
      setError("Selecione uma imagem (PNG/JPG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImgUrl(String(reader.result || ""));
    reader.onerror = () => setError("Não foi possível ler a imagem.");
    reader.readAsDataURL(file);
  }

  function validate() {
    if (!nome.trim()) return "Informe o nome do produto.";

    const pVenda = Number(String(preco).replace(",", "."));
    if (!preco.trim()) return "Informe o preço de venda.";
    if (!Number.isFinite(pVenda) || pVenda < 0) return "Preço de venda inválido.";

    const pCusto = Number(String(custo).replace(",", "."));
    if (!custo.trim()) return "Informe o preço de custo.";
    if (!Number.isFinite(pCusto) || pCusto < 0) return "Preço de custo inválido.";

    const e = Number(estoque || 0);
    const min = Number(minimo || 0);
    const max = Number(maximo || 0);

    if (e < 0 || min < 0 || max < 0) return "Estoque/mínimo/máximo não podem ser negativos.";
    if (max > 0 && min > max) return "Estoque mínimo não pode ser maior que o máximo.";

    if (!descricao.trim()) return "Informe uma descrição simples.";

    return "";
  }

  function formatPrice(v) {
    const n = Number(String(v).replace(",", "."));
    if (!Number.isFinite(n)) return "0,00";
    return n.toFixed(2).replace(".", ",");
  }

  function nextSkuFallback() {
    return `SKU-${String(Date.now()).slice(-6)}`;
  }

  function addProduto(e) {
    e.preventDefault();
    setError("");
    setOk("");

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    const novo = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      nome: nome.trim(),
      sku: sku.trim() || nextSkuFallback(),
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

    const next = [novo, ...produtos];
    setProdutos(next);
    saveProducts(userId, next);

    // reset
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
    setOk("Produto cadastrado!");
  }

  function remover(id) {
    const next = produtos.filter((p) => p.id !== id);
    setProdutos(next);
    saveProducts(userId, next);
  }

  return (
    <div className="products-page">
      <div className="products-topbar">
        <div className="products-logo-row">
          <div className="products-logo-left">
            <div className="products-logo-badge">VF</div>
            <div>
              <div className="products-logo-name">{store?.nomeLoja || "Minha Loja"}</div>
              <div className="products-logo-desc">Cadastro de produtos</div>
            </div>
          </div>

          <div className="products-store-thumb" title="Logo da loja">
            <img src={logoUrl} alt="Logo da loja" />
          </div>
        </div>
      </div>

      <div className="products-center">
        <div className="products-card">
          <h1 className="products-title">Cadastrar produtos</h1>
          <p className="products-subtitle">
            Preencha os dados completos do produto para integrar com o estoque.
          </p>

          {error && <div className="products-alert products-alert-error">{error}</div>}
          {ok && <div className="products-alert products-alert-success">{ok}</div>}

          <form className="products-form" onSubmit={addProduto}>
            <div className="products-grid-2">
              <label className="products-label">
                <span>Nome do produto</span>
                <input
                  className="products-input"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Bolo de chocolate"
                />
              </label>

              <label className="products-label">
                <span>SKU (opcional)</span>
                <input
                  className="products-input"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Ex: BOL-CHOC-001"
                />
              </label>
            </div>

            <label className="products-label">
              <span>Descrição simplificada</span>
              <input
                className="products-input"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Tamanho médio, bem recheado."
              />
            </label>

            <div className="products-grid-2">
              <label className="products-label">
                <span>Categoria</span>
                <input
                  className="products-input"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Ex: Alimentos"
                />
              </label>

              <label className="products-label">
                <span>Fornecedor</span>
                <input
                  className="products-input"
                  value={fornecedor}
                  onChange={(e) => setFornecedor(e.target.value)}
                  placeholder="Ex: Distribuidora XYZ"
                />
              </label>
            </div>

            <div className="products-grid-2">
              <label className="products-label">
                <span>Preço de Venda (R$)</span>
                <input
                  className="products-input"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="Ex: 19,90"
                />
              </label>

              <label className="products-label">
                <span>Preço de Custo (R$)</span>
                <input
                  className="products-input"
                  value={custo}
                  onChange={(e) => setCusto(e.target.value)}
                  placeholder="Ex: 12,00"
                />
              </label>
            </div>

            <div className="products-stock-block">
              <div className="products-stock-title">Regras de Estoque</div>

              <div className="products-grid-3">
                <label className="products-label">
                  <span>Estoque Atual</span>
                  <input
                    className="products-input"
                    type="number"
                    min="0"
                    step="1"
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
                    min="0"
                    step="1"
                    value={minimo}
                    onChange={(e) => setMinimo(e.target.value)}
                    placeholder="0"
                  />
                </label>

                <label className="products-label">
                  <span>Estoque Máximo</span>
                  <input
                    className="products-input"
                    type="number"
                    min="0"
                    step="1"
                    value={maximo}
                    onChange={(e) => setMaximo(e.target.value)}
                    placeholder="0"
                  />
                </label>
              </div>
            </div>

            <div className="upload-row">
              <div className="upload-preview">
                <img src={imgUrl || PLACEHOLDER_IMG} alt="Imagem do produto" />
              </div>

              <div className="upload-box">
                <input
                  className="upload-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickImage(e.target.files?.[0])}
                  aria-label="Enviar imagem do produto"
                />
                <div className="upload-label" role="button" tabIndex={0}>
                  <div className="upload-plus">+</div>
                  <div className="upload-text">
                    <b>Adicionar imagem do produto</b>
                    <small>Essa imagem também aparecerá no estoque.</small>
                  </div>
                </div>
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
                    <img src={p.imagem || PLACEHOLDER_IMG} alt={p.nome} />
                  </div>

                  <div className="product-mini-info">
                    <div className="product-mini-name">{p.nome}</div>
                    <div className="product-mini-desc">{p.descricao}</div>
                    <div className="product-mini-meta">
                      SKU: {p.sku || "—"} • Estoque: {Number(p.estoque || 0)}
                    </div>
                    <div className="product-mini-price">
                      Venda: R$ {formatPrice(p.preco)} • Custo: R$ {formatPrice(p.custo)}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="product-mini-remove"
                    onClick={() => remover(p.id)}
                  >
                    Remover
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}