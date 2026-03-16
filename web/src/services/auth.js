import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

function traduzirErroFirebase(error) {
  const code = error?.code || "";

  switch (code) {
    case "auth/email-already-in-use":
      return "Esse email já está cadastrado.";
    case "auth/invalid-email":
      return "Email inválido.";
    case "auth/weak-password":
      return "Senha deve ter no mínimo 6 caracteres.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email ou senha inválidos.";
    default:
      return error?.message || "Ocorreu um erro ao autenticar.";
  }
}

async function montarUsuarioSeguro(firebaseUser) {
  const ref = doc(db, "usuarios", firebaseUser.uid);
  const snap = await getDoc(ref);
  const extra = snap.exists() ? snap.data() : {};

  return {
    idUsuario: firebaseUser.uid,
    nome: extra.nome ?? firebaseUser.displayName ?? "",
    email: firebaseUser.email ?? "",
    role: extra.role ?? "lojista",
    cpf: extra.cpf ?? "",
    segmento: extra.segmento ?? "",
  };
}

export const authService = {
  async register({ nome, cpf, email, senha, segmento }) {
    try {
      if (!nome || !cpf || !email || !senha || !segmento) {
        throw new Error("Preencha todos os campos.");
      }

      const cpfClean = String(cpf).replace(/\D/g, "");
      if (cpfClean.length !== 11) {
        throw new Error("CPF inválido (11 dígitos).");
      }

      const emailLower = String(email).trim().toLowerCase();
      if (!emailLower.includes("@")) {
        throw new Error("Email inválido.");
      }

      if (String(senha).length < 6) {
        throw new Error("Senha deve ter no mínimo 6 caracteres.");
      }

      const cred = await createUserWithEmailAndPassword(auth, emailLower, senha);

      await updateProfile(cred.user, { displayName: nome.trim() });

      await setDoc(
        doc(db, "usuarios", cred.user.uid),
        {
          idUsuario: cred.user.uid,
          nome: nome.trim(),
          cpf: cpfClean,
          email: emailLower,
          role: "lojista",
          segmento: String(segmento).trim(),
          createdAt: Date.now(),
        },
        { merge: true }
      );

      const user = await montarUsuarioSeguro(cred.user);
      const token = await cred.user.getIdToken();

      return { user, token };
    } catch (error) {
      throw new Error(traduzirErroFirebase(error));
    }
  },

  async login({ email, senha }) {
    try {
      if (!email || !senha) {
        throw new Error("Informe email e senha.");
      }

      const cred = await signInWithEmailAndPassword(
        auth,
        String(email).trim().toLowerCase(),
        senha
      );

      const user = await montarUsuarioSeguro(cred.user);
      const token = await cred.user.getIdToken();

      return { user, token };
    } catch (error) {
      throw new Error(traduzirErroFirebase(error));
    }
  },

  async logout() {
    await signOut(auth);
  },

  async getCurrentSession(firebaseUser = auth.currentUser) {
    if (!firebaseUser) return null;

    const user = await montarUsuarioSeguro(firebaseUser);
    const token = await firebaseUser.getIdToken();

    return { user, token };
  },
};