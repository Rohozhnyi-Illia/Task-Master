import React from 'react';
import styles from './GreetingBadge.module.scss';

interface GreetingBadgeProps {
  name: string;
}

const GreetingBadge = ({ name }: GreetingBadgeProps) => {
  return (
    <div className={styles.badge}>
      <h2 className={styles.badge__title}>Hello, {name} 👋</h2>
      <h4 className={styles.badge__subtitle}>Check your notifications.</h4>
    </div>
  );
};

export default GreetingBadge;
