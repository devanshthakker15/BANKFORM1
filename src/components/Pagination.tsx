import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageGroupSize = 5;

  // Calculate dynamic start and end pages to keep currentPage in the center 
  const calculatePageRange = () => {
    let startPage = Math.max(1, currentPage - Math.floor(pageGroupSize / 2));
    let endPage = startPage + pageGroupSize - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - pageGroupSize + 1);
    }

    return { startPage, endPage };
  };

  const { startPage, endPage } = calculatePageRange();

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination d-flex justify-content-end align-items-center mt-4 mb-3">
      <button
        className="btn btn-primary"
        style={{ width: '40px', marginRight: '10px' }}
        disabled={currentPage === 1}
        onClick={handlePrev}
        aria-label="Previous page"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <div className="d-flex">
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <button
          style={{ width: '40px', marginRight: '10px' }}
            key={page}
            className={`btn ${page === currentPage ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="btn btn-primary"
        style={{ width: '40px', marginLeft: '10px' }}
        disabled={currentPage === totalPages}
        onClick={handleNext}
        aria-label="Next page"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default Pagination;
