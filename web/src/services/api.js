import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const produtosRef = collection(db, "produtos");
const pedidosRef = collection(db, "pedidos");

function ordenarPorDataDesc(lista, campo = "createdAt") {
  return [...lista].sort((a, b) => Number(b?.[campo] || 0) - Number(a?.[campo] || 0));
}

export const api = {
  async getProdutos(userId) {
    if (!userId) return [];

    const q = query(produtosRef, where("userId", "==", userId));
    const snap = await getDocs(q);
    const data = snap.docs.map((item) => ({ id: item.id, ...item.data() }));
    return ordenarPorDataDesc(data, "createdAt");
  },

  async addProduto(produto) {
    if (!produto?.userId) {
      throw new Error("Usuário não autenticado.");
    }

    const id =
      produto.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));

    const payload = {
      ...produto,
      id,
      createdAt: produto.createdAt || Date.now(),
    };

    await setDoc(doc(db, "produtos", id), payload, { merge: true });
    return payload;
  },

  async updateProduto(id, produto) {
    const payload = {
      ...produto,
      id,
      updatedAt: Date.now(),
    };

    await setDoc(doc(db, "produtos", id), payload, { merge: true });
    return payload;
  },

  async deleteProduto(id) {
    await deleteDoc(doc(db, "produtos", id));
  },

  async getPedidos(userId) {
    if (!userId) return [];

    const q = query(pedidosRef, where("userId", "==", userId));
    const snap = await getDocs(q);
    const data = snap.docs.map((item) => ({ id: item.id, ...item.data() }));
    return ordenarPorDataDesc(data, "createdAt");
  },

  async addPedido(pedido) {
    if (!pedido?.userId) {
      throw new Error("Usuário não autenticado.");
    }

    const id =
      pedido.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));

    const payload = {
      ...pedido,
      id,
      createdAt: pedido.createdAt || Date.now(),
      status: pedido.status || "Concluído",
    };

    await setDoc(doc(db, "pedidos", id), payload, { merge: true });
    return payload;
  },

  async updatePedido(id, pedido) {
    const payload = {
      ...pedido,
      id,
      updatedAt: Date.now(),
    };

    await setDoc(doc(db, "pedidos", id), payload, { merge: true });
    return payload;
  },

  async finalizarVenda({
    userId,
    carrinho,
    nomeCliente,
    telefoneCliente,
    totalCarrinho,
    status,
    data,
  }) {
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    if (!Array.isArray(carrinho) || carrinho.length === 0) {
      throw new Error("Carrinho vazio.");
    }

    const pedidoRef = doc(collection(db, "pedidos"));

    await runTransaction(db, async (transaction) => {
      for (const item of carrinho) {
        const produtoRef = doc(db, "produtos", item.id);
        const produtoSnap = await transaction.get(produtoRef);

        if (!produtoSnap.exists()) {
          throw new Error(`Produto não encontrado: ${item.nome}`);
        }

        const produtoAtual = produtoSnap.data();
        const estoqueAtual = Number(produtoAtual.estoque || 0);
        const quantidadeVendida = Number(item.qtd || 0);
        const novoEstoque = estoqueAtual - quantidadeVendida;

        if (novoEstoque < 0) {
          throw new Error(`Estoque insuficiente para ${item.nome}`);
        }

        transaction.update(produtoRef, {
          estoque: novoEstoque,
          updatedAt: Date.now(),
        });
      }

      transaction.set(pedidoRef, {
        id: pedidoRef.id,
        userId,
        data: data || new Date().toISOString(),
        createdAt: Date.now(),
        status: status || "Concluído",
        cliente: {
          nome: nomeCliente || "",
          telefone: telefoneCliente || "",
        },
        itens: carrinho,
        total: totalCarrinho,
      });
    });

    return { id: pedidoRef.id };
  },
};