import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Auth/Home.jsx";
import Register from "../pages/Auth/Register.jsx";
import HomeWelcome from "../pages/Auth/HomeWelcome.jsx";
import Products from "../pages/Products/Products.jsx";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<HomeWelcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />


      {/* ✅ login não existe mais */}
      <Route path="/login" element={<Navigate to="/" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
