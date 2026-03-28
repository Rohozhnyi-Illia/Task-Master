import React from 'react';
import styles from './Item.module.scss';

interface ItemProps {
  task: string;
}

const Item = ({ task }: ItemProps) => {
  return (
    <div className={styles.item} data-testid="drag-and-drop-item">
      <p className={styles.item__text}>{task}</p>
    </div>
  );
};

export default Item;
