import React from 'react';
import { FaTrash } from 'react-icons/fa';
import styles from './NotificationActionButton.module.scss';

interface NotificationActionButtonProps {
  text: string;
  onClick: () => void;
}

const NotificationActionButton = ({ text, onClick }: NotificationActionButtonProps) => (
  <button className={styles.notifications__button} onClick={onClick}>
    <p>{text}</p>
    <FaTrash />
  </button>
);

export default NotificationActionButton;
