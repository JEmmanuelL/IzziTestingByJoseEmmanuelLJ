import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IpSearchBar from './IpSearchBar';

// Mock de SweetAlert2
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

import Swal from 'sweetalert2';

describe('IpSearchBar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('se renderiza correctamente sin estado de carga', () => {
    render(<IpSearchBar onSearch={vi.fn()} isLoading={false} />);
    
    // Verificar que el input y botón existan
    expect(screen.getByPlaceholderText(/Ingresa una dirección IP/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
  });

  it('el input está deshabilitado en estado de carga', () => {
    render(<IpSearchBar onSearch={vi.fn()} isLoading={true} />);
    
    expect(screen.getByPlaceholderText(/Ingresa una dirección IP/i)).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('llama a Swal con error al enviar vacío', () => {
    render(<IpSearchBar onSearch={vi.fn()} />);
    const button = screen.getByRole('button', { name: /buscar/i });
    
    fireEvent.click(button);
    
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      icon: 'warning',
      title: 'Campo vacío'
    }));
  });

  it('llama a Swal con error al enviar IP inválida', () => {
    render(<IpSearchBar onSearch={vi.fn()} />);
    const input = screen.getByPlaceholderText(/Ingresa una dirección IP/i);
    const button = screen.getByRole('button', { name: /buscar/i });
    
    // Ingresar IP inválida
    fireEvent.change(input, { target: { value: '999.999.999.999' } });
    fireEvent.click(button);
    
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      icon: 'error',
      title: 'IP inválida'
    }));
  });

  it('invoca onSearch con IP válida', () => {
    const handleSearch = vi.fn();
    render(<IpSearchBar onSearch={handleSearch} />);
    
    const input = screen.getByPlaceholderText(/Ingresa una dirección IP/i);
    const button = screen.getByRole('button', { name: /buscar/i });
    
    fireEvent.change(input, { target: { value: '8.8.8.8' } });
    fireEvent.click(button);
    
    expect(handleSearch).toHaveBeenCalledWith('8.8.8.8');
    expect(Swal.fire).not.toHaveBeenCalledWith(expect.objectContaining({ icon: 'error' }));
  });
});
