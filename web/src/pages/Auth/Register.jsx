import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

import Input from "../../components/UI/Input/Input.jsx";
import Button from "../../components/UI/Button/Button.jsx";
import ErrorMessage from "../../components/UI/ErrorMessage/ErrorMessage.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth(); 
  
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState(""); 
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [segmento, setSegmento] = useState(""); 
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setErro("");

    
    if (!nome || !cpf || !email || !senha || !segmento) {
      return setErro("Por favor, preencha todos os campos.");
    }
    if (senha.length < 6) {
      return setErro("A senha deve ter pelo menos 6 caracteres.");
    }

    try {
      setLoading(true);
      
      await register({ nome, cpf, email, senha, segmento });
      navigate("/home"); 
    } catch (err) {
      
      setErro(err.message || "Erro ao criar conta.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="auth-title">Criar Conta</h1>
      <p className="auth-subtitle">Junte-se a dezenas de lojistas no VitrineFácil.</p>

      <ErrorMessage message={erro} />

      <form className="auth-form" onSubmit={handleRegister}>
        
        <Input 
          label="Nome Completo"
          id="nome"
          type="text"
          placeholder="João Silva"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          error={!!erro && !nome}
        />

        <Input 
          label="CPF"
          id="cpf"
          type="text"
          placeholder="000.000.000-00"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          error={!!erro && !cpf}
        />

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
          placeholder="No mínimo 6 caracteres"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          error={!!erro && (!senha || senha.length < 6)}
        />

        
        <label className="auth-label" htmlFor="segmento">
          Segmento da Loja
          <select 
            id="segmento"
            className="auth-input" 
            value={segmento}
            onChange={(e) => setSegmento(e.target.value)}
          >
            <option value="Moda">Moda e Vestuário</option>
            <option value="Alimentação">Alimentação</option>
            <option value="Eletrônicos">Eletrônicos</option>
            <option value="Serviços">Serviços</option>
            <option value="Outros">Outros</option>
          </select>
        </label>

        <Button type="submit" isLoading={loading}>
          Criar minha conta
        </Button>

        <p className="auth-footer">
          Já tem uma conta? <Link to="/login">Fazer Login</Link>
        </p>
      </form>
    </>
  );
}