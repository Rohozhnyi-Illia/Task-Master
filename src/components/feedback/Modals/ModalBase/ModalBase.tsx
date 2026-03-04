import React from 'react';
import ReactDOM from 'react-dom';
import styles from './ModalBase.module.scss';

interface ModalBaseProps {
  children: React.ReactNode;
  onClose: () => void;
  modifier: string;
}

const ModalBase = ({ children, onClose, modifier = '' }: ModalBaseProps) => {
  return ReactDOM.createPortal(
    <div className={styles.modal} onClick={onClose}>
      <div
        className={`${styles.modal__content} ${modifier ? styles[modifier] : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};
export default ModalBase;
