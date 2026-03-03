import React from 'react';
import styles from './Pagination.module.scss';
import { back, next } from '@assets/index';

interface PaginationProps {
  pageNumbers: number[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (value: number) => void;
}

const Pagination = (props: PaginationProps) => {
  const { pageNumbers, totalPages, currentPage, setCurrentPage } = props;

  const nextHandler = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
    }
  };

  const backHandler = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
    }
  };

  return (
    <div className={styles.pagination} tabIndex={0}>
      <div className={styles.pagination__back}>
        <button onClick={backHandler} disabled={currentPage === 1}>
          <img src={back} alt="back" />
        </button>
      </div>

      <div className={styles.pagination__pages}>
        {pageNumbers.map((num) => (
          <div
            key={num}
            className={`${styles.pagination__pageNumber} ${
              num === currentPage ? styles.active : ''
            }`}
            onClick={() => setCurrentPage(num)}
          >
            <p>{num}</p>
          </div>
        ))}
      </div>

      <div className={styles.pagination__next}>
        <button onClick={nextHandler} disabled={currentPage >= totalPages}>
          <img src={next} alt="next" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
