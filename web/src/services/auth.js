const SESSION_KEY = "vf_session";
const USERS_KEY = "vf_users";

/**
 * JWT mock: header.payload.signature (payload base64 com exp + role)
 * Sem segurança real (somente para front mockado).
 */
function b64(obj) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}
function b64parse(str) {
  return JSON.parse(decodeURIComponent(escape(atob(str))));
}
function makeToken(payload) {
  const header = b64({ alg: "none", typ: "JWT" });
  const body = b64(payload);
  return `${header}.${body}.`;
}
function decodeToken(token) {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  return b64parse(parts[1]);
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const authService = {
  getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  },

  setSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  clearSession() {
    localStorage.removeItem(SESSION_KEY);
  },

  isTokenValid(token) {
    try {
      const payload = decodeToken(token);
      if (!payload?.exp) return false;
      return Date.now() < payload.exp;
    } catch {
      return false;
    }
  },

  // ✅ AGORA register NÃO recebe role e sempre cadastra como lojista
  register({ nome, cpf, email, senha, segmento }) {
    if (!nome || !cpf || !email || !senha || !segmento) {
      throw new Error("Preencha todos os campos.");
    }

    const users = loadUsers();

    const cpfClean = String(cpf).replace(/\D/g, "");
    if (cpfClean.length !== 11) throw new Error("CPF inválido (11 dígitos).");

    const emailLower = String(email).trim().toLowerCase();
    if (!emailLower.includes("@")) throw new Error("Email inválido.");

    if (senha.length < 6) throw new Error("Senha deve ter no mínimo 6 caracteres.");

    if (users.some((u) => u.email === emailLower)) {
      throw new Error("Esse email já está cadastrado.");
    }
    if (users.some((u) => u.cpf === cpfClean)) {
      throw new Error("Esse CPF já está cadastrado.");
    }
    if (!segmento || !String(segmento).trim()) {
  throw new Error("Selecione o segmento do lojista.");
}

    

    const newUser = {
      idUsuario: crypto.randomUUID(),
      nome,
      cpf: cpfClean,
      email: emailLower,
      senha, // mock (não hash)
      role: "lojista", // ✅ SEMPRE lojista
      segmento: String(segmento || "").trim()
      
    };

    users.push(newUser);
    saveUsers(users);

    const token = makeToken({
      sub: newUser.idUsuario,
      email: newUser.email,
      role: newUser.role,
      exp: Date.now() + 1000 * 60 * 60 // 1h
    });

    const safeUser = {
      idUsuario: newUser.idUsuario,
      nome: newUser.nome,
      email: newUser.email,
      role: newUser.role,
      cpf: newUser.cpf,
      segmento: newUser.segmento
    };

    this.setSession({ user: safeUser, token });

    return { user: safeUser, token };
  },

  login({ email, senha }) {
    if (!email || !senha) throw new Error("Informe email e senha.");

    const users = loadUsers();
    const emailLower = String(email).trim().toLowerCase();
    const user = users.find((u) => u.email === emailLower);

    if (!user || user.senha !== senha) {
      throw new Error("Email ou senha inválidos.");
    }

    const token = makeToken({
      sub: user.idUsuario,
      email: user.email,
      role: user.role,
      exp: Date.now() + 1000 * 60 * 60 // 1h
    });

    const safeUser = {
      idUsuario: user.idUsuario,
      nome: user.nome,
      email: user.email,
      role: user.role,
      cpf: user.cpf
    };

    this.setSession({ user: safeUser, token });

    return { user: safeUser, token };
  }
};
