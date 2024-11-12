import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Button from "./Button";

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
<Button
  variant="primary"
  disabled={currentPage === 1}
  onClick={handlePrev}
  style={{ marginRight: '10px' , width: "50px" }}
>
  <FontAwesomeIcon icon={faChevronLeft} />
</Button>

<div className="d-flex">
  {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
    <Button
      key={page}
      variant={page === currentPage ? 'primary' : 'outline-primary'}
      onClick={() => onPageChange(page)}
      style={{ marginRight: '10px', width: "50px" }}
    >
      {page}
    </Button>
  ))}
</div>

<Button
  variant="primary"
  disabled={currentPage === totalPages}
  onClick={handleNext}
  style={{  width: "50px" }}
>
  <FontAwesomeIcon icon={faChevronRight} />
</Button>
    </div>
  );
};

export default Pagination;
