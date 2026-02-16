import React from 'react'
import * as styles from './ErrorMessage.module.scss'

const ErrorMessage = ({ error, className = '' }) => {
  return <p className={`${styles.errorMessage} ${className}`}>{error}</p>
}

export default ErrorMessage
