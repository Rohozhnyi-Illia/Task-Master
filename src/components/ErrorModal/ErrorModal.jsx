import React from 'react'
import * as styles from './ErrorModal.module.scss'
import errorImg from '../../assets/images/error.svg'
import AuthButton from '../AuthButton/AuthButton'
import ReactDOM from 'react-dom'

const ErrorModal = ({ error, onClick }) => {
  return ReactDOM.createPortal(
    <div className={styles.modal} onClick={onClick}>
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modal__header}>
          <img src={errorImg} alt="modal icon" className={styles.modal__img} />
          <h4 className={styles.modal__title}>Error</h4>
        </header>

        <p className={styles.modal__text}>{error}</p>

        <AuthButton text={'Try again'} type="button" onClick={onClick} />
      </div>
    </div>,
    document.body
  )
}

export default ErrorModal
