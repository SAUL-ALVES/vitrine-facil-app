
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

