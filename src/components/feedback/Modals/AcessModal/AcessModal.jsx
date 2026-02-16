import React from 'react'
import { ModalBase } from '@components'
import { AuthButton } from '@components'
import { done } from '@assets'
import * as styles from './AcessModal.module.scss'

const AccessModal = ({ onClick, text }) => {
  return (
    <ModalBase onClose={onClick} modifier="access">
      <header className={styles.header}>
        <img src={done} alt="Error icon" className={styles.img} />
        <h4 className={styles.title}>Success</h4>
      </header>

      <p className={styles.text}>{text || 'Action completed'}</p>

      <div className={styles.buttonWrapper}>
        <AuthButton text="Continue" type="button" onClick={onClick} />
      </div>
    </ModalBase>
  )
}

export default AccessModal
