import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Auth/Home.jsx";
import Register from "../pages/Auth/Register.jsx";
import HomeWelcome from "../pages/Auth/HomeWelcome.jsx";
import Products from "../pages/Products/Products.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<HomeWelcome />} />
      <Route path="/products" element={<Products />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
      


      {/* ✅ login não existe mais */}
      <Route path="/login" element={<Navigate to="/" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
