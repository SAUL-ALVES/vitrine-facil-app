import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

function buildFileName(file) {
  const original = file?.name || "imagem.jpg";
  const cleaned = original.replace(/[^a-zA-Z0-9._-]/g, "_");
  const hasExt = cleaned.includes(".");
  const ext = hasExt ? cleaned.split(".").pop() : "jpg";
  const uid =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${uid}.${ext}`;
}

export async function uploadProdutoImagem(file, userId) {
  if (!file) return "";

  if (!userId) {
    throw new Error("Usuário não autenticado.");
  }

  const fileName = buildFileName(file);
  const fileRef = ref(storage, `produtos/${userId}/${fileName}`);

  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}