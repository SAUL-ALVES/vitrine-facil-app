import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const firebaseService = {
  async getLojas() {
    try {
      const snap = await getDocs(collection(db, "usuarios"));

      return snap.docs
        .map((docItem) => {
          const data = docItem.data() || {};

          return {
            id: docItem.id,
            nome: data.nome || "Lojista",
            nomeLoja: data.nomeLoja || data.nome || "Loja sem nome",
            segmento: data.segmento || "Outros",
            cidade: data.cidade || data.bairro || "Sua cidade",
            imagemCapa: data.imagemCapa || data.imagem || "",
            role: data.role || "lojista",
          };
        })
        .filter((loja) => loja.role === "lojista");
    } catch (error) {
      console.error("Erro ao buscar lojas no Firebase:", error);
      return [];
    }
  },
};