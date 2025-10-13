import React from 'react'
import * as styles from './AuthButton.module.scss'

const AuthButton = ({ text }) => {
  return (
    <button className={styles.auth__button} type="submit">
      {text}
    </button>
  )
}

export default AuthButton
