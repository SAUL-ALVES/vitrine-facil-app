import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

const STORE_KEY = "vf_store_profile";

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

function saveStoreProfile(userId, data) {
  const raw = localStorage.getItem(STORE_KEY);
  const all = safeParse(raw) || {};
  all[userId] = data;
  localStorage.setItem(STORE_KEY, JSON.stringify(all));
}

export default function HomeWelcome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userId = user?.idUsuario || user?.id || user?.sub || "anon";
  const placeholderImg = "https://placehold.net/200x200.png";

  const saved = useMemo(() => loadStoreProfile(userId), [userId]);

  // Imagem (preview)
  const [fotoUrl, setFotoUrl] = useState(saved?.fotoUrl || ""); // dataURL

  // Campos do perfil
  const [nomeLoja, setNomeLoja] = useState(saved?.nomeLoja || "");
  const [endereco, setEndereco] = useState(saved?.endereco || "");
  const [horario, setHorario] = useState(saved?.horario || "");
  const [numeroLoja, setNumeroLoja] = useState(saved?.numeroLoja || "");

  // Entrega (condicional)
  const [fazEntrega, setFazEntrega] = useState(saved?.fazEntrega ?? true);
  const [tempoEntrega, setTempoEntrega] = useState(saved?.tempoEntrega || "");
  const [temEntregador, setTemEntregador] = useState(saved?.temEntregador ?? true);

  const [error, setError] = useState("");

  useEffect(() => {
    const s = loadStoreProfile(userId);
    if (s) {
      setFotoUrl(s.fotoUrl || "");
      setNomeLoja(s.nomeLoja || "");
      setEndereco(s.endereco || "");
      setHorario(s.horario || "");
      setNumeroLoja(s.numeroLoja || "");
      setFazEntrega(s.fazEntrega ?? true);
      setTempoEntrega(s.tempoEntrega || "");
      setTemEntregador(s.temEntregador ?? true);
    }
  }, [userId]);

  function onPickImage(file) {
    setError("");

    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      setError("Selecione uma imagem (PNG/JPG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setFotoUrl(String(reader.result || ""));
    reader.onerror = () => setError("Não foi possível ler a imagem.");
    reader.readAsDataURL(file);
  }

  function validate() {
    setError("");

    if (!nomeLoja.trim()) return "Informe o nome da loja.";
    if (!endereco.trim()) return "Informe o endereço.";
    if (!horario.trim()) return "Informe o horário de funcionamento.";

    if (fazEntrega && !tempoEntrega.trim()) return "Informe o tempo de entrega.";

    return "";
  }

  function onSubmit(e) {
    e.preventDefault();

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    const profile = {
      fotoUrl: fotoUrl || "",
      nomeLoja: nomeLoja.trim(),
      endereco: endereco.trim(),
      horario: horario.trim(),
      numeroLoja: numeroLoja.trim(),

      fazEntrega: !!fazEntrega,
      tempoEntrega: fazEntrega ? tempoEntrega.trim() : "",
      temEntregador: fazEntrega ? !!temEntregador : false,

      updatedAt: Date.now(),
    };

    saveStoreProfile(userId, profile);

    // vai para cadastro de produtos
    navigate("/products");
  }

  const uploadId = "upload-loja-foto";

  return (
    <div className="auth-page">
      <div className="auth-topbar">
        <div className="auth-logo">
          <div className="auth-logo-badge">VF</div>
          <div>
            <div className="auth-logo-name">VitrineFácil</div>
            <div className="auth-logo-desc">Continue fazendo seu perfil</div>
          </div>
        </div>
      </div>

      <div className="auth-center">
        <div className="auth-card">
          <h1 className="auth-title">Continue fazendo seu perfil</h1>
          <p className="auth-subtitle">Essas informações vão aparecer para os clientes.</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={onSubmit}>
            {/* Upload bonito */}
            <div className="upload-row">
              <div className="upload-preview">
                <img src={fotoUrl || placeholderImg} alt="Foto de perfil da loja" />
              </div>

              <div className="upload-box">
                <input
                  id={uploadId}
                  className="upload-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickImage(e.target.files?.[0])}
                />

                <label className="upload-label" htmlFor={uploadId}>
                  <div className="upload-plus">+</div>
                  <div className="upload-text">
                    <b>Adicionar foto da loja</b>
                    <small>PNG ou JPG. Se não enviar, usaremos uma imagem genérica.</small>
                  </div>
                </label>
              </div>
            </div>

            <label className="auth-label">
              Nome da loja
              <input
                className="auth-input"
                value={nomeLoja}
                onChange={(e) => setNomeLoja(e.target.value)}
                placeholder="Ex: Loja da Ana"
              />
            </label>

            <label className="auth-label">
              Endereço
              <input
                className="auth-input"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, número, bairro, cidade"
              />
            </label>

            <label className="auth-label">
              Número da loja (opcional)
              <input
                className="auth-input"
                value={numeroLoja}
                onChange={(e) => setNumeroLoja(e.target.value)}
                placeholder="Ex: 12B"
              />
            </label>

            <label className="auth-label">
              Horário de funcionamento
              <input
                className="auth-input"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                placeholder="Ex: Seg–Sáb 08:00–18:00"
              />
            </label>

            {/* Entrega condicional */}
            <label className="auth-label">
              Tem condições de fazer entrega?
              <select
                className="auth-input"
                value={fazEntrega ? "sim" : "nao"}
                onChange={(e) => {
                  const yes = e.target.value === "sim";
                  setFazEntrega(yes);

                  if (!yes) {
                    setTempoEntrega("");
                    setTemEntregador(false);
                  }
                }}
              >
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </label>

            {fazEntrega && (
              <>
                <label className="auth-label">
                  Tempo de entrega
                  <input
                    className="auth-input"
                    value={tempoEntrega}
                    onChange={(e) => setTempoEntrega(e.target.value)}
                    placeholder="Ex: 30–45 min"
                  />
                </label>

                <label className="auth-label">
                  Possui entregador?
                  <select
                    className="auth-input"
                    value={temEntregador ? "sim" : "nao"}
                    onChange={(e) => setTemEntregador(e.target.value === "sim")}
                  >
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </label>
              </>
            )}

            <button className="auth-button" type="submit">
              Salvar e continuar
            </button>

            <p className="auth-footer">
              Quer voltar?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                style={{
                  background: "transparent",
                  border: 0,
                  padding: 0,
                  cursor: "pointer",
                  color: "#0f766e",
                  fontWeight: 900,
                }}
              >
                Ir para o início
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
