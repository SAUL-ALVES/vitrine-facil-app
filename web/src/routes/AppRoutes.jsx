import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";


import Home from "../pages/Auth/Home.jsx";
import Register from "../pages/Auth/Register.jsx";
import HomeWelcome from "../pages/Auth/HomeWelcome.jsx";
import Products from "../pages/Products/Products.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Estoque from "../pages/Estoque/Estoque.jsx";
import Caixa from "../pages/Caixa/Caixa.jsx";
import Pedidos from "../pages/Pedidos/Pedidos.jsx";

import Vitrine from "../pages/Vitrine/Vitrine.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ROTA PRINCIPAL (PÚBLICA) */}
      <Route path="/" element={<Vitrine />} />

      {/* ROTAS DO LOJISTA */}
      <Route path="/login" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<HomeWelcome />} />
      
      {/* Rotas Internas do Sistema */}
      <Route path="/products" element={<Products />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/estoque" element={<Estoque />} />
      <Route path="/caixa" element={<Caixa />} />
      <Route path="/pedidos" element={<Pedidos />} />

      {/* Rota de segurança: Digitou besteira? Volta pra Vitrine principal */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}