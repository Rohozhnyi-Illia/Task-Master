import React from 'react'
import styles from './AcessModal.module.scss'
import { ModalBase, AuthButton } from '@components/index'
import { done } from '@assets/index'

interface AccessModalProps {
  onClick: () => void
  text: string
}

const AccessModal = ({ onClick, text }: AccessModalProps) => {
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
