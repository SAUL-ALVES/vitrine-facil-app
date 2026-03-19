import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";


import Input from "../../components/UI/Input/Input.jsx";
import Button from "../../components/UI/Button/Button.jsx";
import ErrorMessage from "../../components/UI/ErrorMessage/ErrorMessage.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    
    if (!email || !senha) {
      return setErro("Por favor, preencha todos os campos.");
    }

    try {
      setLoading(true);
      await login({email, senha});
      navigate("/dashboard");
    } catch (err) {
      // setErro("Credenciais inválidas ou erro no servidor.")
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="auth-title">Entrar</h1>
      <p className="auth-subtitle">Que bom te ver novamente!</p>

      {/* Componente de Erro Modularizado */}
      <ErrorMessage message={erro} />

      <form className="auth-form" onSubmit={handleLogin}>
        
        {/* Componentes de Input Limpos e Reutilizáveis */}
        <Input 
          label="E-mail"
          id="email"
          type="email"
          placeholder="exemplo@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!erro && !email} 
        />

        <Input 
          label="Senha"
          id="senha"
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          error={!!erro && !senha}
        />

        {/* Componente de Botão com estado de Loading */}
        <Button type="submit" isLoading={loading}>
          Entrar
        </Button>

        <p className="auth-footer">
          Não tem uma conta? <Link to="/register">Criar uma agora</Link>
        </p>
      </form>
    </>
  );
}