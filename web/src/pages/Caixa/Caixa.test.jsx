import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../../contexts/AuthContext.jsx', () => ({
  useAuth: () => ({ user: { idUsuario: 'u1', nome: 'Ana' }, logout: vi.fn() }),
}));

vi.mock('../../services/api.js', () => ({
  api: {
    getProdutos: vi.fn(),
    finalizarVenda: vi.fn(),
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
import Caixa from './Caixa.jsx';

describe('Caixa page - RF07 carrinho + RF08 checkout', () => {
  beforeEach(() => {
    api.getProdutos.mockReset();
    api.finalizarVenda.mockReset();
    api.getProdutos.mockResolvedValue([
      { id: 'p1', nome: 'Produto 1', preco: 10, estoque: 3, imagem: '', categoria: 'Test' },
      { id: 'p2', nome: 'Produto 2', preco: 20, estoque: 0, imagem: '', categoria: 'Test' },
    ]);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('adds product to cart and updates total', async () => {
    render(<Caixa />);
    await screen.findByText(/Produto 1/i);
    await userEvent.click(screen.getByText(/Produto 1/i));
    expect(screen.getByText(/Carrinho \(1\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/R\$ 10,00/).length).toBeGreaterThan(0);
  });

  it('prevents adding out-of-stock product', async () => {
    render(<Caixa />);
    const button = await screen.findByRole('button', { name: /Produto 2/i });
    expect(button).toBeDisabled();
  });

  it('finalizes venda and clears cart', async () => {
    api.finalizarVenda.mockResolvedValue();
    render(<Caixa />);
    await screen.findByText(/Produto 1/i);
    await userEvent.click(screen.getByText(/Produto 1/i));
    await userEvent.click(screen.getByText(/Finalizar Venda/i));
    expect(api.finalizarVenda).toHaveBeenCalled();
  });
});
