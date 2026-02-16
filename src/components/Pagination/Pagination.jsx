import React from 'react'
import * as styles from './Pagination.module.scss'
import { back, next } from '@assets'

const Pagination = ({ pageNumbers, totalPages, currentPage, setCurrentPage }) => {
  const nextHandler = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const backHandler = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  return (
    <div className={styles.pagination}>
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
  )
}

export default Pagination
