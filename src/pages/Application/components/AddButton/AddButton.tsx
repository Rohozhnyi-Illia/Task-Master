import React from 'react';
import styles from './AddButton.module.scss';
import { addTask } from '@assets/index';

type AddButtonType = 'button' | 'submit' | 'reset';

interface AddButtonProps {
  className?: string;
  type: AddButtonType;
  disabled?: boolean;
  onClick?: () => void;
}

const AddButton = ({ className, type = 'button', ...props }: AddButtonProps) => {
  return (
    <button
      type={type}
      className={`${styles.addButton} ${className}`}
      {...props}
      data-testid="add-button"
    >
      New Task
      <img src={addTask} alt="add task" className={styles.addButton__icon} />
    </button>
  );
};

export default AddButton;
