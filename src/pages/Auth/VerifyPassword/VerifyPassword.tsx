import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Auth.module.scss';
import { bg } from '@assets/index';
import fields from '@utils/fields/verifyPasswordFields';
import passwordVerifySchema from '@utils/validation/passwordVerify-validation';
import { Input, AuthButton, ErrorModal, AccessModal } from '@components/index';
import { useNavigate } from 'react-router-dom';
import AuthService from '@services/authService';
import { showLoader, closeLoader } from '@store/UI/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { PasswordVerifyValues } from '@utils/validation/passwordVerify-validation';
import * as yup from 'yup';

type FormErrors = {
  newPassword?: string;
  repeatPassword?: string;
  verifyCode?: string;
};

interface DataInterface {
  newPassword: string;
  repeatPassword: string;
  verifyCode: string;
}

const VerifyPassword = () => {
  const [data, setData] = useState<DataInterface>({
    newPassword: '',
    repeatPassword: '',
    verifyCode: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState<string>('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [accessAction, setAccessAction] = useState<boolean>(false);
  const isLoaderShown: boolean = useSelector((state: RootState) => state.loader.isLoaderShown);
  const sessionEmail = sessionStorage.getItem('resetEmail');

  const formId = 'verifyPassword';

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openModalHandler = () => {
    setIsErrorModalOpen(!isErrorModalOpen);
    return;
  };

  const handleModalClick = () => {
    if (authError === 'Email not found, please restart password reset flow') {
      navigate('/update-password', { replace: true });
    } else {
      setIsErrorModalOpen(false);
    }
  };

  const navigateHandler = () => {
    setAccessAction(false);
    sessionStorage.removeItem('resetEmail');
    navigate('/login', { replace: true });
    return;
  };

  useEffect(() => {
    if (!sessionEmail) {
      navigate('/update-password', { replace: true });
    }
  }, [navigate]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    setErrors({});
    dispatch(showLoader());

    if (!sessionEmail) {
      setAuthError('Email not found, please restart password reset flow');
      setIsErrorModalOpen(true);
      dispatch(closeLoader());
      return;
    }

    try {
      const validatedData: PasswordVerifyValues = await passwordVerifySchema.validate(data, {
        abortEarly: false,
      });

      const res = await AuthService.verifyPassword({
        email: sessionEmail,
        newPassword: validatedData.newPassword,
        repeatPassword: validatedData.repeatPassword,
        verifyCode: validatedData.verifyCode,
      });

      if (!res.success) {
        setAuthError(res.error);
        openModalHandler();
        setAccessAction(false);
        return;
      }

      setAccessAction(true);
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};

        err.inner.forEach((e) => {
          if (e.path) newErrors[e.path] = e.message;
        });

        setErrors(newErrors);
      } else if (err instanceof Error) {
        setAuthError(err.message);
        setIsErrorModalOpen(true);
      }
    } finally {
      dispatch(closeLoader());
    }
  };

  return (
    <div className={styles.auth} style={{ backgroundImage: `url(${bg})` }}>
      <div className={styles.auth__container}>
        <div className={styles.auth__container_wrapper}>
          <div className={styles.auth__header}>
            <h2 className={styles.auth__headerTitle}>Verify Password</h2>
            <p className={styles.auth__headerSubtitle}>
              Enter the 6-digit code we sent to your email
            </p>
          </div>

          <form className={styles.auth__form} onSubmit={onSubmitHandler}>
            {fields.map((field) => (
              <Input
                key={field.label}
                formId={formId}
                label={field.label}
                placeholder={field.placeholder}
                name={field.name}
                value={String(data[field.name as keyof DataInterface] ?? '')}
                onChange={onChangeHandler}
                img={field.img}
                authOptions={field.authOptions}
                err={String(errors[field.name as keyof FormErrors] ?? '')}
                type={field.type !== 'password' ? 'text' : 'password'}
              />
            ))}

            <div className={styles.auth__footer}>
              <p className={styles.auth__signupLink}>
                Remembered your password? <Link to={'/login'}>Log In</Link>
              </p>
            </div>

            <AuthButton text="Update" disabled={isLoaderShown} type="submit" />
          </form>
        </div>
      </div>

      {isErrorModalOpen && <ErrorModal error={authError} onClick={handleModalClick} />}
      {accessAction && (
        <AccessModal onClick={navigateHandler} text="Password successfully changed" />
      )}
    </div>
  );
};

export default VerifyPassword;
