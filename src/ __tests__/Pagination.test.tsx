// import { render, screen, fireEvent } from '@testing-library/react';
// import Pagination from '../components/Pagination';

// describe('Pagination', () => {
//   const onPageChange = jest.fn();

//   it('renders correctly and displays current page', () => {
//     render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

//     expect(screen.getByText(/page 2 of 5/i)).toBeInTheDocument();
//   });

//   it('calls onPageChange when clicking next button', () => {
//     render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

//     const nextButton = screen.getByRole('button', { name: /next page/i });
//     fireEvent.click(nextButton);

//     expect(onPageChange).toHaveBeenCalledWith(3);
//   });

//   it('calls onPageChange when clicking previous button', () => {
//     render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

//     const prevButton = screen.getByRole('button', { name: /previous page/i });
//     fireEvent.click(prevButton);

//     expect(onPageChange).toHaveBeenCalledWith(1);
//   });

//   it('disables previous button on first page', () => {
//     render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

//     const prevButton = screen.getByRole('button', { name: /previous page/i });
//     expect(prevButton).toBeDisabled();
//   });

//   it('disables next button on last page', () => {
//     render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />);

//     const nextButton = screen.getByRole('button', { name: /next page/i });
//     expect(nextButton).toBeDisabled();
//   });
// });


import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../components/Pagination";

describe("Pagination Component", () => {
  const onPageChangeMock = jest.fn();

  it("renders pagination buttons correctly", () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChangeMock} />);

    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("Next page")).not.toBeDisabled();
  });

  it("calls onPageChange with the correct page number on next button click", () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChangeMock} />);

    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChangeMock).toHaveBeenCalledWith(2);
  });

  it("displays the correct range of page buttons based on currentPage", () => {
    render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChangeMock} />);

    const pageButtons = screen.getAllByRole("button", { name: /\d+/ });
    expect(pageButtons.map(btn => btn.textContent)).toEqual(["1", "2", "3", "4", "5"]);
  });
});
