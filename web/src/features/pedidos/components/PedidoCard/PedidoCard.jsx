import React from 'react';
import { User, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import './PedidoCard.css';

// Função utilitária extraída do ficheiro principal
function formatarDataVisivel(dataString) {
  const data = new Date(dataString);
  const hoje = new Date();
  const ehHoje = data.getDate() === hoje.getDate() && data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
  const horaFormatada = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  if (ehHoje) return `Hoje, ${horaFormatada}`;
  return `${data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} às ${horaFormatada}`;
}

export default function PedidoCard({ pedido, onCancelar }) {
  const status = pedido.status || "Concluído";
  const isConcluido = status === "Concluído";
  const isCancelado = status === "Cancelado";
  const qtdTotalItens = (pedido.itens || []).reduce((acc, item) => acc + (item.qtd || 0), 0);

  return (
    <div className={`pedido-card ${isConcluido ? "card-concluido" : isCancelado ? "card-cancelado" : "card-concluido"}`}>
      <div className="pedido-cabecalho">
        <div className="pedido-data-cliente">
          <span className="pedido-data">{formatarDataVisivel(pedido.data)}</span>
          <div className="pedido-cliente">
            <User size={16} />
            <strong>{pedido.cliente?.nome || "Cliente Balcão"}</strong>
          </div>
        </div>

        <div className="pedido-total">
          R$ {Number(pedido.total || 0).toFixed(2).replace(".", ",")}
        </div>
      </div>

      <div className="pedido-resumo">
        <span className="resumo-texto">
          {qtdTotalItens} {qtdTotalItens === 1 ? "item" : "itens"} na compra
        </span>
        <button className="btn-ver-detalhes">
          Detalhes <ChevronRight size={16} />
        </button>
      </div>

      <div className="pedido-acoes">
        <div className={`status-badge ${isConcluido ? "status-verde" : isCancelado ? "status-vermelho" : "status-verde"}`}>
          {isConcluido ? <CheckCircle size={14} /> : isCancelado ? <XCircle size={14} /> : <CheckCircle size={14} />}
          {status}
        </div>

        {isConcluido && !isCancelado && (
          <button className="btn-cancelar" onClick={() => onCancelar(pedido)}>
            Marcar como Cancelado
          </button>
        )}
      </div>
    </div>
  );
}