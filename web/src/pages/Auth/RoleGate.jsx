import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RoleGate() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 720, background: "#fff", borderRadius: 16, padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>VitrineFácil</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          {/* ✅ Só Lojista */}
          <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
            <h3 style={{ margin: 0 }}>Lojista</h3>
            <p style={{ marginTop: 8, opacity: 0.8 }}>Vender e gerenciar a loja</p>
            <button
              onClick={() => navigate("/register")}
              style={{ padding: "10px 14px", cursor: "pointer" }}
            >
              Cadastrar
            </button>
          </div>
        </div>

        <p style={{ marginTop: 16 }}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
