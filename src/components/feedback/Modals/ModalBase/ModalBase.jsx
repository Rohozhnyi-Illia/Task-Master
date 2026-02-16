import React from 'react'
import ReactDOM from 'react-dom'
import * as styles from './ModalBase.module.scss'

const ModalBase = ({ children, onClose, modifier = '' }) => {
  return ReactDOM.createPortal(
    <div className={styles.modal} onClick={onClose}>
      <div
        className={`${styles.modal__content} ${modifier ? styles[modifier] : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
export default ModalBase
