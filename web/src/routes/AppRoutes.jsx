import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

import Home from "../pages/Auth/Home.jsx";
import Register from "../pages/Auth/Register.jsx";
import HomeWelcome from "../pages/Auth/HomeWelcome.jsx";
import Products from "../pages/Products/Products.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Estoque from "../pages/Estoque/Estoque.jsx";
import Caixa from "../pages/Caixa/Caixa.jsx";
import Pedidos from "../pages/Pedidos/Pedidos.jsx";
import Vitrine from "../pages/Vitrine/Vitrine.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ROTA PRINCIPAL (PÚBLICA) */}
      <Route path="/" element={<Vitrine />} />

      {/* ROTAS DO LOJISTA (PÚBLICAS) */}
      <Route path="/login" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* ROTAS INTERNAS PROTEGIDAS */}
      <Route path="/home" element={<ProtectedRoute><HomeWelcome /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/estoque" element={<ProtectedRoute><Estoque /></ProtectedRoute>} />
      <Route path="/caixa" element={<ProtectedRoute><Caixa /></ProtectedRoute>} />
      <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />

      {/* Rota de segurança: Digitou besteira? Volta pra Vitrine principal */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
