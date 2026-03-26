# Vitrine Fácil
 
> Catálogo virtual para o pequeno varejo de Tauá-CE — desenvolvido como projeto final da disciplina de **Programação Web II**.
 
🔗 **Deploy:** [vitrine-facil.vercel.app](https://vitrine-facil.vercel.app)
 
---
 
## 1. Sobre o Projeto

O **Vitrine Fácil** é uma tecnologia social criada para reduzir a exclusão digital e aumentar a competitividade de microempreendedores, pequenos varejistas e produtores da agricultura familiar na região de Tauá-CE.

A solução transforma o celular e o WhatsApp em uma plataforma de negócios acessível, reduzindo a carga cognitiva no gerenciamento de estoque e vendas.

### Escopo entregue (Programação Web II)

O escopo de entrega contemplou exclusivamente a **interface web** (`/web`), que inclui:

- Vitrine pública para clientes visualizarem lojas cadastradas
- Autenticação de lojistas (cadastro e login via Firebase)
- Perfil e configuração da loja
- Cadastro, edição e exclusão de produtos com controle de estoque
- Módulo de Caixa (PDV) com carrinho de compras e finalização de venda
- Histórico de pedidos com filtros e atualização de status
- Dashboard com resumo financeiro e gráfico de vendas


> As pastas `/mobile` e `/server` representam extensões planejadas do sistema, **não implementadas dentro do prazo e escopo da disciplina**. São descritas na seção [Módulos Não Implementados](#5-módulos-não-implementados).

---

## 2. Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| Framework UI | React 19 + Vite (rolldown-vite) |
| Roteamento | React Router DOM v7 |
| Banco de Dados | Firebase Firestore |
| Autenticação | Firebase Auth |
| Armazenamento de Imagens | Firebase Storage |
| Ícones | Lucide React |
| Deploy | Vercel |

---

## 3. Instruções de Execução

### Pré-requisitos

- **Node.js LTS** (v20 ou superior)
- Conta no [Firebase](https://firebase.google.com/) com um projeto criado

### 3.1 Clone o repositório

```bash
git clone https://github.com/SAUL-ALVES/vitrine-facil-app
cd vitrine-facil
```

### 3.2 Configure as variáveis de ambiente

Dentro da pasta `web`, crie um arquivo `.env` com as credenciais do seu projeto Firebase:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 3.3 Instale as dependências e rode o projeto

```bash
cd web
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### 3.4 Outros comandos úteis

```bash
npm run build      # Gera o build de produção
npm run preview    # Visualiza o build localmente
npm run lint       # Roda o ESLint
```

---

## 4. Organização de Pastas (`/web`)

```
web/
├── public/                        # Arquivos estáticos
├── src/
│   ├── components/                # Componentes globais reutilizáveis
│   │   ├── UI/                    # Átomos de interface
│   │   │   ├── BrandLogo/         # Logo da marca
│   │   │   ├── Button/            # Botão com estado de loading
│   │   │   ├── ErrorMessage/      # Mensagem de erro animada
│   │   │   ├── Input/             # Campo de texto padronizado
│   │   │   ├── ProductModal/      # Modal de criação/edição de produto
│   │   │   ├── Select/            # Select estilizado
│   │   │   └── TopHeaderEditButton/
│   │   └── layout/                # Componentes de estrutura de página
│   │       ├── BottomNav/         # Navegação inferior (mobile)
│   │       └── TopHeader/         # Cabeçalho com logo, ações e logout
│   │
│   ├── features/                  # Módulos de domínio (Feature-Sliced)
│   │   ├── auth/                  # Autenticação
│   │   │   ├── context/           # AuthContext (estado global do usuário)
│   │   │   ├── pages/
│   │   │   │   └── Auth/
│   │   │   │       ├── Layout/    # AuthLayout (wrapper das páginas públicas)
│   │   │   │       ├── Profile/   # HomeWelcome (perfil da loja)
│   │   │   │       ├── Login.jsx
│   │   │   │       ├── Register.jsx
│   │   │   │       
│   │   │   └── services/
│   │   │       └── auth.js        # Integração com Firebase Auth + Firestore
│   │   │
│   │   ├── caixa/                 # PDV / Módulo de vendas
│   │   │   └── pages/Caixa/       # Caixa.jsx — grade de produtos + carrinho
│   │   │
│   │   ├── carrinho/              # Componente lateral do carrinho
│   │   │   └── components/CarrinhoLateral/
│   │   │
│   │   ├── dashboard/             # Painel do lojista
│   │   │   ├── components/
│   │   │   │   ├── GraficoVendas/ # Gráfico de barras dos últimos 5 dias
│   │   │   │   └── LojaCard/      # Card de loja para vitrine pública
│   │   │   └── pages/Dashboard/   # Dashboard.jsx — resumo financeiro
│   │   │
│   │   ├── estoque/               # Gerenciamento de estoque
│   │   │   ├── components/EstoqueStats/  # Cards de estatísticas
│   │   │   └── pages/Estoque/     # Estoque.jsx — lista + filtros + FAB
│   │   │
│   │   ├── pedidos/               # Histórico de vendas
│   │   │   ├── components/
│   │   │   │   ├── PedidoCard/    # Card individual de pedido
│   │   │   │   └── PedidosFiltros/ # Barra de busca e chips de filtro
│   │   │   └── pages/Pedidos/     # Pedidos.jsx — listagem e cancelamento
│   │   │
│   │   ├── produtos/              # Componentes e páginas de produtos
│   │   │   ├── components/
│   │   │   │   ├── ImageUploader/ # Upload de imagem com preview
│   │   │   │   ├── ProdutoCard/   # Card completo para tela de estoque
│   │   │   │   ├── ProdutoGrid/   # Grade de produtos para o PDV
│   │   │   │   └── ProdutoMiniCard/ # Mini card para listagem rápida
│   │   │   └── pages/Products/    # Products.jsx — formulário de cadastro
│   │   │
│   │   └── vitrine/               # Vitrine pública (área do cliente)
│   │       ├── components/
│   │       │   ├── VitrineHero/   # Seção hero com gradiente escuro
│   │       │   └── VitrineSearch/ # Barra de busca + chips de segmento
│   │       └── pages/Vitrine/     # Vitrine.jsx — página inicial pública
│   │
│   ├── infra/                     # Camada de infraestrutura
│   │   ├── firebase/
│   │   │   └── firebase.js        # Inicialização do Firebase + firebaseService
│   │   ├── http/
│   │   │   └── api.js             # CRUD de produtos e pedidos via Firestore
│   │   └── storage/
│   │       └── storage.js         # Upload de imagens no Firebase Storage
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx          # Definição de rotas (públicas e protegidas)
│   │
│   ├── App.jsx                    # Raiz da aplicação
│   ├── main.jsx                   # Entry point (BrowserRouter + AuthProvider)
│   └── styles.css                 # Design tokens (variáveis CSS globais)
│   
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js

```

---

## 5. Módulos Não Implementados

O repositório contém duas pastas adicionais que representam extensões planejadas para o sistema, mas que **não foram desenvolvidas dentro do prazo e escopo da disciplina de Programação Web II**:

### `/mobile` — App Nativo (React Native + Expo)

Planejado como aplicativo Android para o lojista gerenciar o negócio diretamente pelo celular, com foco em uso offline e integração com a câmera para leitura de QR Code. Não implementado pois extrapola o escopo da disciplina, que tem foco em desenvolvimento web.

### `/server` — API REST (Node.js + Express)

Planejado como backend independente com Node.js, Express e PostgreSQL, substituindo o uso direto do Firebase no frontend. O `package.json` do server já contém as dependências base (`express`, `cors`, `dotenv`, `pg`), mas nenhuma rota ou lógica foi implementada. Optou-se por manter o Firebase como BaaS diretamente no frontend para viabilizar a entrega dentro do prazo.

---

## 6. Objetivo Social

O **Vitrine Fácil** busca democratizar o acesso à tecnologia para pequenos negócios, promovendo inclusão digital de microempreendedores, melhoria na organização de vendas e estoque, ampliação do alcance comercial via ambiente digital e fortalecimento da economia local em Tauá-CE.