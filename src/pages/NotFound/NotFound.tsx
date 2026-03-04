import React from 'react';
import { notFound } from '@assets/index';
import styles from './NotFound.module.scss';
import { TbArrowBackUp } from 'react-icons/tb';
import { selectIsAuth } from '@store/authSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const isAuth: boolean = useSelector(selectIsAuth);
  const navigate = useNavigate();

  const navigateHandler = () => {
    navigate(isAuth ? '/application' : '/login', { replace: true });
  };

  return (
    <div className={styles.notFound}>
      <div className={styles.notFound__content}>
        <img src={notFound} alt="Not Found" className={styles.notFound__img} />
        <p className={styles.notFound__text}>Oops, Page Not Found...</p>

        <div className={styles.notFound__btnWrapper}>
          <button className={styles.notFound__btn} onClick={navigateHandler}>
            <TbArrowBackUp />
            {isAuth ? 'Go to Dashboard' : 'Go to Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
