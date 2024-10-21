import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../components/Pagination';

describe('Pagination', () => {
  const onPageChange = jest.fn();

  it('renders correctly and displays current page', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    expect(screen.getByText(/page 2 of 5/i)).toBeInTheDocument();
  });

  it('calls onPageChange when clicking next button', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when clicking previous button', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    const prevButton = screen.getByRole('button', { name: /previous page/i });
    fireEvent.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('disables previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    const prevButton = screen.getByRole('button', { name: /previous page/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole('button', { name: /next page/i });
    expect(nextButton).toBeDisabled();
  });
});
