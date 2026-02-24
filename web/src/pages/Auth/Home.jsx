import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function Home() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, senha });
      navigate("/home"); // ✅ vai direto pro BEM-VINDO
    } catch (err) {
      setError(err?.message || "Erro ao entrar.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-topbar">
        <div className="auth-logo">
          <div className="auth-logo-badge">VF</div>
          <div>
            <div className="auth-logo-name">VitrineFácil</div>
            <div className="auth-logo-desc">Acesse sua conta</div>
          </div>
        </div>
      </div>

      <div className="auth-center">
        <div className="auth-card">
          <h1 className="auth-title">Entrar</h1>
          <p className="auth-subtitle">Faça login para acessar o sistema</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={onSubmit}>
            <label className="auth-label">
              Email
              <input
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
              />
            </label>

            <label className="auth-label">
              Senha
              <input
                className="auth-input"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </label>

            <button className="auth-button" type="submit">
              Entrar
            </button>
          </form>

          <p className="auth-footer">
            Não tem conta?{" "}
            <span
              style={{ cursor: "pointer", color: "#0f766e", fontWeight: 900 }}
              onClick={() => navigate("/register")}
            >
              Criar conta
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
