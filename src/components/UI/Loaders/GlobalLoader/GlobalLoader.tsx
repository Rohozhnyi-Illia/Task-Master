import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './GlobalLoader.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

const GlobalLoader = () => {
  const isLoaderShown: boolean = useSelector((state: RootState) => state.loader.isLoaderShown);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isLoaderShown) {
      setVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = '';
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoaderShown]);

  if (!visible) return null;

  return createPortal(
    <div
      className={`${styles.loader__container} ${isLoaderShown ? styles.show : styles.hide}`}
      data-testid="global-loader"
    >
      <div className={styles.loader}></div>
    </div>,
    document.body,
  );
};

export default GlobalLoader;
