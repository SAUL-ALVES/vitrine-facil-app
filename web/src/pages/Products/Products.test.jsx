import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../../contexts/AuthContext.jsx', () => ({
  useAuth: () => ({ user: { idUsuario: 'u1' } }),
}));

vi.mock('../../services/api.js', () => ({
  api: {
    getProdutos: vi.fn().mockResolvedValue([]),
    addProduto: vi.fn().mockResolvedValue(),
    updateProduto: vi.fn(),
    deleteProduto: vi.fn(),
  },
}));

vi.mock('../../services/storage.js', () => ({
  uploadProdutoImagem: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
    useNavigate: () => vi.fn(),
  };
});

import { api } from '../../services/api.js';
import Products from './Products.jsx';

describe('Products page - RF04/RF12', () => {
  beforeEach(() => {
    api.getProdutos.mockReset().mockResolvedValue([]);
    api.addProduto.mockReset().mockResolvedValue();
  });

  it('shows empty state when no products', async () => {
    api.getProdutos.mockResolvedValueOnce([]);
    render(<Products />);
    expect(await screen.findByText(/Nenhum produto cadastrado ainda/i)).toBeInTheDocument();
  });

  it('shows validation error if name is empty', async () => {
    api.getProdutos.mockResolvedValueOnce([]);
    render(<Products />);
    await userEvent.click(screen.getByRole('button', { name: /Salvar produto/i }));
    expect(await screen.findByText(/Informe o nome/i)).toBeInTheDocument();
    expect(api.addProduto).not.toHaveBeenCalled();
  });

  it('calls api.addProduto on valid product', async () => {
    api.getProdutos.mockResolvedValue([]);
    api.addProduto.mockResolvedValue();
    render(<Products />);
    await userEvent.type(screen.getByLabelText(/Nome/i), 'Camisa Teste');
    await userEvent.type(screen.getByLabelText(/Venda \(R\$\)/i), '49.90');
    await userEvent.type(screen.getByLabelText(/Custo \(R\$\)/i), '29.50');
    await userEvent.click(screen.getByRole('button', { name: /Salvar produto/i }));
    expect(await screen.findByText(/Produto salvo com sucesso/i)).toBeInTheDocument();
    expect(api.addProduto).toHaveBeenCalled();
  });
});
