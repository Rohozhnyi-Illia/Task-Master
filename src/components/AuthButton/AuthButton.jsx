import React from 'react'
import * as styles from './AuthButton.module.scss'

const AuthButton = ({ text, onClick, type = 'submit' }) => {
  return (
    <button className={styles.auth__button} onClick={onClick} type={type}>
      {text}
    </button>
  )
}

export default AuthButton
