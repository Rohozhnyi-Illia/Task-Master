import React from 'react';
import styles from './NotificationActionButton.module.scss';
import { trashWhite } from '@assets/index';

interface NotificationActionButtonProps {
  text: string;
  onClick: () => void;
}

const NotificationActionButton = ({ text, onClick }: NotificationActionButtonProps) => (
  <button
    className={styles.notifications__button}
    onClick={onClick}
    data-testid="notification-action-button"
  >
    <p>{text}</p>
    <img src={trashWhite} alt="" />
  </button>
);

export default NotificationActionButton;
