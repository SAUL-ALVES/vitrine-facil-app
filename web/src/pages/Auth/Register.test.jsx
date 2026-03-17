import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from './Register.jsx';

const registerMock = vi.fn();
const navigateMock = vi.fn();

vi.mock('../../contexts/AuthContext.jsx', () => ({
  useAuth: () => ({
    register: registerMock,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
    useNavigate: () => navigateMock,
  };
});

describe('Register page - RF02 cadastro do lojista', () => {
  beforeEach(() => {
    registerMock.mockReset();
    navigateMock.mockReset();
  });

  it('should display form fields and submit button', () => {
    render(<Register />);
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cadastrar/i })).toBeInTheDocument();
  });

  it('should show password mismatch error', async () => {
    render(<Register />);
    await userEvent.type(screen.getByLabelText(/Nome/i), 'Ana');
    await userEvent.type(screen.getByLabelText(/CPF/i), '12345678901');
    await userEvent.type(screen.getByLabelText(/Email/i), 'ana@email.com');
    await userEvent.type(screen.getByLabelText(/^Senha$/i), '123456');
    await userEvent.type(screen.getByLabelText(/Confirmar senha/i), '654321');
    await userEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    expect(await screen.findByText(/As senhas não coincidem/i)).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('should call register and navigate to home on success', async () => {
    registerMock.mockResolvedValue({ user: { id: 'u1', nome: 'Lojista' }, token: 'abc' });
    render(<Register />);

    await userEvent.type(screen.getByLabelText(/Nome/i), 'Ana');
    await userEvent.type(screen.getByLabelText(/CPF/i), '12345678901');
    await userEvent.type(screen.getByLabelText(/Email/i), 'ana@email.com');
    await userEvent.type(screen.getByLabelText(/^Senha$/i), '123456');
    await userEvent.type(screen.getByLabelText(/Confirmar senha/i), '123456');
    await userEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    expect(registerMock).toHaveBeenCalledWith(expect.objectContaining({ nome: 'Ana', cpf: '12345678901', email: 'ana@email.com' }));
    expect(navigateMock).toHaveBeenCalledWith('/home');
  });
});
