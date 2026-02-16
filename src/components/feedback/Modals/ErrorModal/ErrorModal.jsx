import React from 'react'
import ModalBase from '../ModalBase/ModalBase'
import { errorImg } from '@assets'
import AuthButton from '../../../UI/AuthButton/AuthButton'
import * as styles from './ErrorModal.module.scss'

const ErrorModal = ({ error, onClick }) => {
  return (
    <ModalBase onClose={onClick} modifier="error">
      <header className={styles.header}>
        <img src={errorImg} alt="Error icon" className={styles.img} />
        <h4 className={styles.title}>Error</h4>
      </header>

      <p className={styles.text}>{error}</p>

      <div className={styles.buttonWrapper}>
        <AuthButton text="Try again" type="button" onClick={onClick} />
      </div>
    </ModalBase>
  )
}

export default ErrorModal
