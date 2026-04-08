import React from 'react';
import styles from './GreetingBadge.module.scss';

interface GreetingBadgeProps {
  name: string;
  subtitle: string;
}

const GreetingBadge = ({ name, subtitle }: GreetingBadgeProps) => {
  return (
    <div className={styles.badge} data-testid="greeting-badge">
      <h2 className={styles.badge__title}>Hello, {name} 👋</h2>
      <h4 className={styles.badge__subtitle}>{subtitle}.</h4>
    </div>
  );
};

export default GreetingBadge;
