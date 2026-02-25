import React from 'react'
import styles from './AuthButton.module.scss'

type AuthButtonType = 'submit' | 'button' | 'reset'

interface AuthButtonProps {
  text: string
  onClick: () => void
  type: AuthButtonType
  disabled: boolean
}

const AuthButton = ({ text, onClick, type = 'submit', disabled }: AuthButtonProps) => {
  return (
    <button disabled={disabled} className={styles.auth__button} onClick={onClick} type={type}>
      {text}
    </button>
  )
}

export default AuthButton
