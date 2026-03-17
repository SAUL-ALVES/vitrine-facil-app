import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../../contexts/AuthContext.jsx', () => ({
  useAuth: () => ({ user: { idUsuario: 'u1', nome: 'Ana' }, logout: vi.fn() }),
}));

vi.mock('../../services/api.js', () => ({
  api: {
    getPedidos: vi.fn(),
    updatePedido: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

import { api } from '../../services/api.js';
import Pedidos from './Pedidos.jsx';

describe('Pedidos page - RF09/RF11', () => {
  beforeEach(() => {
    api.getPedidos.mockReset();
    api.updatePedido.mockReset();
    api.getPedidos.mockResolvedValue([
      { id: '1', data: new Date().toISOString(), cliente: { nome: 'João' }, status: 'Pendente', itens: [{ qtd: 1 }], total: 10 },
      { id: '2', data: new Date().toISOString(), cliente: { nome: 'Maria' }, status: 'Concluído', itens: [{ qtd: 2 }], total: 20 },
    ]);
  });

  it('displays orders and filters by status', async () => {
    render(<Pedidos />);
    expect(await screen.findByText(/João/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Concluídos/i }));
    expect(screen.queryByText(/João/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Maria/i)).toBeInTheDocument();
  });

});
