import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
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
      const q = query(collection(db, "usuarios"), where("role", "==", "lojista"));
      const snap = await getDocs(q);

      return snap.docs.map((docItem) => {
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
      });
    } catch (error) {
      if (error?.code === "permission-denied") {
        return [];
      }

      console.error("Erro ao buscar lojas no Firebase:", error);
      return [];
    }
  },
};