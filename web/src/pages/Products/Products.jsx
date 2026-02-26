import React, { useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

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

  // form
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imgUrl, setImgUrl] = useState(""); // dataURL
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
    if (!preco.trim()) return "Informe o preço.";
    // aceita "19,90" ou "19.90"
    const p = Number(preco.replace(",", "."));
    if (!Number.isFinite(p) || p <= 0) return "Preço inválido.";
    if (!descricao.trim()) return "Informe uma descrição simples.";
    return "";
  }

  function formatPrice(v) {
    const n = Number(String(v).replace(",", "."));
    return n.toFixed(2).replace(".", ",");
  }

  function addProduto(e) {
    e.preventDefault();
    setError("");
    setOk("");

    const msg = validate();
    if (msg) return setError(msg);

    const novo = {
      id: crypto.randomUUID(),
      nome: nome.trim(),
      preco: Number(preco.replace(",", ".")),
      descricao: descricao.trim(),
      imagem: imgUrl || PLACEHOLDER_IMG,
      createdAt: Date.now()
    };

    const next = [novo, ...produtos];
    setProdutos(next);
    saveProducts(userId, next);

    setNome("");
    setPreco("");
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
    <div className="auth-page">
      <div className="auth-topbar">
        <div className="auth-logo" style={{ width: "100%", justifyContent: "space-between" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <div className="auth-logo-badge">VF</div>
            <div>
              <div className="auth-logo-name">{store?.nomeLoja || "Minha Loja"}</div>
              <div className="auth-logo-desc">Cadastro de produtos</div>
            </div>
          </div>

          <div
            style={{
              width: 170,
              height: 54,
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid #e8eef5",
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 12px 26px rgba(15, 23, 42, 0.06)"
            }}
            title="Logo da loja"
          >
            <img
              src={logoUrl}
              alt="Logo da loja"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      <div className="auth-center">
        <div className="auth-card">
          <h1 className="auth-title">Cadastrar produtos</h1>
          <p className="auth-subtitle">Crie seu catálogo: nome, preço, descrição e imagem.</p>

          {error && <div className="auth-error">{error}</div>}
          {ok && (
            <div
              className="auth-error"
              style={{
                borderColor: "rgba(15,118,110,0.25)",
                background: "rgba(15,118,110,0.08)",
                color: "#0f766e"
              }}
            >
              {ok}
            </div>
          )}

          <form className="auth-form" onSubmit={addProduto}>
            <label className="auth-label">
              Nome do produto
              <input
                className="auth-input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Bolo de chocolate"
              />
            </label>

            <label className="auth-label">
              Preço (R$)
              <input
                className="auth-input"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="Ex: 19,90"
              />
            </label>

            <label className="auth-label">
              Descrição simplificada
              <input
                className="auth-input"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Tamanho médio, bem recheado."
              />
            </label>

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
                    <small>Se não enviar, usamos imagem genérica.</small>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
              <button className="auth-button" type="submit">
                Salvar produto
              </button>
              
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  border: "2px solid #0A7B6C",
                  background: "transparent",
                  color: "#0A7B6C",
                  cursor: "pointer",
                  width: "100%",
                  fontSize: "16px",
                  transition: "all 0.2s"
                }}
              >
                Pular por enquanto
              </button>
            </div>
          </form>

          {/* lista */}
          <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
            {produtos.length === 0 ? (
              <p className="auth-subtitle" style={{ margin: 0, textAlign: "center" }}>
                Nenhum produto cadastrado ainda.
              </p>
            ) : (
              produtos.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "92px 1fr auto",
                    gap: 12,
                    alignItems: "center",
                    padding: 12,
                    border: "1px solid #e8eef5",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.96)",
                    boxShadow: "0 12px 26px rgba(15, 23, 42, 0.06)"
                  }}
                >
                  <div style={{ width: 92, height: 68, borderRadius: 14, overflow: "hidden" }}>
                    <img
                      src={p.imagem || PLACEHOLDER_IMG}
                      alt={p.nome}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div>
                    <div style={{ fontWeight: 900 }}>{p.nome}</div>
                    <div style={{ color: "#64748b", fontSize: 13 }}>{p.descricao}</div>
                    <div style={{ marginTop: 4, fontWeight: 900, color: "#0f766e" }}>
                      R$ {formatPrice(p.preco)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => remover(p.id)}
                    style={{
                      border: "1px solid rgba(239,68,68,0.25)",
                      background: "rgba(239,68,68,0.08)",
                      color: "#b91c1c",
                      fontWeight: 900,
                      padding: "10px 12px",
                      borderRadius: 12,
                      cursor: "pointer"
                    }}
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