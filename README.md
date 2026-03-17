
# Vitrine Fácil – Catálogo Virtual para o Pequeno Varejo (Tauá-CE)

## 1. Visão Geral do Projeto

O **Vitrine Fácil** é uma tecnologia social desenvolvida para combater a exclusão digital e a baixa competitividade de microempreendedores, pequenos varejistas e produtores da agricultura familiar na região de Tauá-CE.  
O projeto foca em reduzir a carga cognitiva no gerenciamento de estoque e vendas, transformando o celular e o WhatsApp em uma plataforma de negócios eficiente.

A solução consiste em:
- Um **aplicativo nativo (Android)** para o lojista gerenciar seu negócio;
- Uma **vitrine web responsiva** para que os clientes visualizem produtos e realizem pedidos de forma organizada.

---

## 2. Requisitos e Instruções Básicas

### Pré-requisitos

- **Node.js (LTS)** instalado  
- **VS Code** com extensões recomendadas para **React / React Native**  
- **Expo Go** instalado no celular (para testes do app mobile)

---

### Como rodar o projeto localmente

#### 2.1 Clone o repositório

```bash
git clone https://github.com/SAUL-ALVES/vitrine-facil-app
cd vitrine-facil
````

#### 2.2 Iniciar o Backend (API)

```bash
cd server
npm install
npm start
```

#### 2.3 Iniciar a Vitrine Web

```bash
cd ../web
npm install
npm run dev
```

#### 2.4 Iniciar o App Mobile

```bash
cd ../mobile
npm install
npx expo start
```

---

## 3. Tecnologias Utilizadas

O projeto adota a arquitetura **Client–Server (Frontend e Backend)**, garantindo separação de responsabilidades e escalabilidade.

* **Mobile (App do Lojista):** React Native com Expo (foco em Android / Play Store)
* **Frontend Web (Vitrine do Cliente):** React.js com Vite (hospedado na Vercel)
* **Backend (API):** Node.js com Express
* **Banco de Dados:** PostgreSQL (Neon DB)
* **Comunicação:** Integração com WhatsApp para envio e notificação de pedidos

---

## 4. Estrutura Inicial do Repositório

O repositório está organizado para garantir manutenibilidade, clareza e isolamento de responsabilidades:

```text
/vitrine-facil
├── /mobile          # App Nativo (React Native) – Gestão do Lojista
├── /web             # Interface Web (React + Vite) – Vitrine do Cliente
├── /server          # API REST (Node.js + Express) – Lógica de Negócio
├── .gitignore       # Arquivos ignorados (node_modules, .env, etc.)
└── README.md        # Documentação principal do projeto
```

---

## 5. Objetivo Social e Impacto Esperado

O **Vitrine Fácil** busca democratizar o acesso à tecnologia para pequenos negócios, promovendo:

* Inclusão digital de microempreendedores;
* Melhoria na organização de vendas e estoque;
* Ampliação do alcance comercial por meio do ambiente digital;
* Fortalecimento da economia local em Tauá-CE.

---

## 6. Testes Automatizados (Unitários + Integração BDD)

Este projeto usa **Vitest** + **React Testing Library** para escrever testes orientados a comportamento do usuário. A suíte cobre os principais requisitos funcionais (RF) do lojista e fluxo cliente.

### 6.1 Como executar

No diretório `web`:

```bash
npm test
npm run test:watch
npm run test:ui
```

### 6.2 Arquivos de testes implementados

- `src/pages/Auth/Register.test.jsx` — RF02: cadastro/login do lojista
- `src/pages/Products/Products.test.jsx` — RF04/RF12: cadastro, edição, exclusão e validações de produto
- `src/pages/Vitrine/Vitrine.test.jsx` — RF06: busca e filtros por nome/categoria
- `src/pages/Caixa/Caixa.test.jsx` — RF07/RF08: carrinho, quantidade, subtotal e finalização de pedido
- `src/pages/Pedidos/Pedidos.test.jsx` — RF09/RF11: listagem de pedidos, filtro por status e atualização de status

### 6.3 O que é validado na suíte

- Cadastro de lojista e navegação após login
- Validação de campos obrigatórios e mensagens de erro
- Controle de estoque no carrinho (não permitir venda sem disponibilidade)
- Cálculo de subtotal e total do pedido
- Filtros de catálogo e pesquisa por nome/categoria
- Atualização de status de pedido (Pendente → Concluído)

### 6.4 Requisitos funcionais cobertos

O projeto implementa testes para garantir os RFs principais:

- **RF02** — Cadastro/Login do lojista
- **RF03** — Cadastro e gestão de loja (informações de loja via fluxo de perfil)
- **RF04** — Cadastro/edição/exclusão/ativação de produtos
- **RF06** — Busca e filtros no catálogo
- **RF07** — Carrinho de compras (adicionar/remover/quantidade)
- **RF08** — Finalização de pedido (checkout no fluxo de caixa)
- **RF09** — Gestão de pedidos do lojista (receber, confirmar, atualizar status)
- **RF11** — Histórico de pedidos do cliente (visualização e status)
- **RF12** — Controle de estoque (prevenir venda sem estoque)
