import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../../services/firebase', () => ({
  firebaseService: {
    getLojas: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

import { firebaseService } from '../../services/firebase';
import Vitrine from './Vitrine.jsx';

describe('Vitrine page - RF06 busca e filtros', () => {
  beforeEach(() => {
    firebaseService.getLojas.mockReset();
    firebaseService.getLojas.mockResolvedValue([
      { id: '1', nomeLoja: 'Loja A', segmento: 'Roupas', cidade: 'SP', nome: 'Ana', imagemCapa: '' },
      { id: '2', nomeLoja: 'Mercado B', segmento: 'Alimentos', cidade: 'RJ', nome: 'Bruno', imagemCapa: '' },
    ]);
  });

  it('shows lojas and allows search', async () => {
    render(<Vitrine />);
    expect(await screen.findByText(/Lojas em destaque/i)).toBeInTheDocument();
    expect(await screen.findByText(/Loja A/i)).toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText(/O que você está procurando hoje/i), 'Mercado');
    expect(await screen.findByText(/Mercado B/i)).toBeInTheDocument();
    expect(screen.queryByText(/Loja A/i)).not.toBeInTheDocument();
  });

  it('filters by segmento chip', async () => {
    render(<Vitrine />);
    expect(await screen.findByText(/Loja A/i)).toBeInTheDocument();
    await userEvent.click(await screen.findByRole('button', { name: /Roupas/i }));
    expect(screen.getByText(/Loja A/i)).toBeInTheDocument();
    expect(screen.queryByText(/Mercado B/i)).not.toBeInTheDocument();
  });
});
