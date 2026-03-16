import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import "./AuthLayout.css";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const loc = useLocation();

  if (isAuthenticated && (loc.pathname === "/login" || loc.pathname === "/cadastro")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-shell">
      <div className="auth-left">
        <div className="auth-card">
          <Outlet />
        </div>
      </div>

      <div className="auth-right">
        <div className="brand-top">
          <div className="brand-badge">VF</div>
          <div>
            <div className="brand-name">VitrineFácil</div>
            <div className="brand-desc">Acesse sua conta com segurança</div>
          </div>
        </div>

        <div className="brand-info">
          <h2>Bem-vindo 👋</h2>
          <p>Faça login para continuar. Se ainda não tiver conta, cadastre-se em poucos segundos.</p>
          <ul>
            <li>Interface limpa e responsiva</li>
            <li>JWT (mockado) com expiração</li>
            <li>Rotas protegidas com PrivateRoute</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
