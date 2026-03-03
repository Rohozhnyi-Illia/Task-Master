import React from 'react';
import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  error: string;
  className: string;
}

const ErrorMessage = ({ error, className = '' }: ErrorMessageProps) => {
  return <p className={`${styles.errorMessage} ${className}`}>{error}</p>;
};

export default ErrorMessage;
