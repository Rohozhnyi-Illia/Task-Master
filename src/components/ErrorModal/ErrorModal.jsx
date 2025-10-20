import React from 'react'
import * as styles from './ErrorModal.module.scss'
import errorImg from '../../assets/images/error.svg'
import AuthButton from '../AuthButton/AuthButton'

const Modal = ({ error, onClick }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modal__content}>
        <header className={styles.modal__header}>
          <img src={errorImg} alt="modal icon" className={styles.modal__img} />
          <h4 className={styles.modal__title}>Error</h4>
        </header>

        <p className={styles.modal__text}>{error}</p>

        <AuthButton text={'Try again'} type="button" onClick={onClick} />
      </div>
    </div>
  )
}

export default Modal
