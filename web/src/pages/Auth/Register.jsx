import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [nome, setNome] = useState("");
  const [segmento, setSegmento] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (senha !== confirmar) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      // ✅ AGORA manda o segmento
      await register({ nome, cpf, email, senha, segmento });

      // ✅ vai direto para o bem-vindo
      navigate("/home");
    } catch (err) {
      setError(err?.message || "Erro ao cadastrar.");
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
          <h1 className="auth-title">Criar conta</h1>
          <p className="auth-subtitle">
            Tipo selecionado: <b>LOJISTA</b>
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={onSubmit}>
            <label className="auth-label">
              Nome
              <input
                className="auth-input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
              />
            </label>

            <label className="auth-label">
              CPF
              <input
                className="auth-input"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="Somente números"
              />
            </label>

            <label className="auth-label">
              Segmento
              <input
                className="auth-input"
                value={segmento}
                onChange={(e) => setSegmento(e.target.value)}
                placeholder="Ex: roupas, alimentos, eletrônicos..."
              />
            </label>

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

            <label className="auth-label">
              Confirmar senha
              <input
                className="auth-input"
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
              />
            </label>

            <button className="auth-button" type="submit">
              Cadastrar
            </button>
          </form>

          <p className="auth-footer">
            Já tem conta? <Link to="/login">Entrar</Link>
            <br />
            <Link to="/">Voltar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
