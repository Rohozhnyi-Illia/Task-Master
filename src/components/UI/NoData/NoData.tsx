import React from 'react';
import { noData } from '@assets/index';
import styles from './NoData.module.scss';

interface NoDataProps {
  text: string;
}

const NoData = ({ text }: NoDataProps) => {
  return (
    <div className={styles.empty} data-testid="empty-block">
      <img src={noData} alt="no data" />
      <h2>{text}</h2>
    </div>
  );
};

export default NoData;
