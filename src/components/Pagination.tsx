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
    <div className="pagination d-flex justify-content-end align-items-center mt-4">
      <button
        className="btn btn-primary"
        style={{ width: '40px', marginRight: '10px'}}
        disabled={currentPage === 1}
        onClick={handlePrev}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="btn btn-primary"
        style={{ width: '40px', marginLeft: '10px' }}
        disabled={currentPage === totalPages}
        onClick={handleNext}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default Pagination;
