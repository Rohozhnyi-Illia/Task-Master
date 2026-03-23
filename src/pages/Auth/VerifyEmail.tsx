import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styles from './Auth.module.scss';
import fields from '@utils/fields/verifyEmailFields';
import { bg } from '@assets/index';
import verifyEmailSchema from '@utils/validation/emailVerify-validation';
import emailSchema from '@utils/validation/email-validation';
import { ErrorModal, AccessModal, Input, AuthButton } from '@components/index';
import { setAuth } from '@store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '@services/authService';
import { useNavigate } from 'react-router-dom';
import { showLoader, closeLoader } from '@store/UI/loaderSlice';
import { RootState } from '@store/store';
import { EmailVerifyValues } from '@utils/validation/emailVerify-validation';
import { EmailValue } from '@utils/validation/email-validation';
import * as yup from 'yup';

type FormErrors = {
  email?: string;
  verifyCode?: string;
};

interface DataInterface {
  email: string;
  verifyCode: string;
}

const VerifyEmail = () => {
  const [data, setData] = useState<DataInterface>({ email: '', verifyCode: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [accessAction, setAccessAction] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const email: string = useSelector((state: RootState) => state.auth.email);
  const isLoaderShown: boolean = useSelector((state: RootState) => state.loader.isLoaderShown);

  const formId = 'verifyEmail';

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const emailFromSession = sessionStorage.getItem('signUpEmail');
    if (!email && !emailFromSession) {
      navigate('/login', { replace: true });
      return;
    } else if (emailFromSession) {
      setData((prev) => ({ ...prev, email: emailFromSession }));
    }
  }, [email, navigate]);

  const navigateHandler = () => {
    setAccessAction(false);
    sessionStorage.removeItem('signUpEmail');
    dispatch(showLoader());
    navigate('/application', { replace: true });
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resendHandler = async () => {
    setErrors({});
    setAuthError('');
    setSuccessMessage('');
    dispatch(showLoader());

    try {
      const validatedData: EmailValue = await emailSchema.validate(
        { email: data.email },
        { abortEarly: false },
      );

      if (!validatedData.email) {
        setAuthError('Enter your email address');
        return;
      }

      const res = await AuthService.reVerifyEmail(validatedData.email);

      if (res.success) {
        setSuccessMessage('A new verification code has been sent to your email.');
      } else {
        setAuthError(res.error);
      }
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        err.inner.forEach((e) => {
          if (e.path === 'email') setEmailError(e.message);
        });
      } else if (err instanceof Error) {
        setAuthError(err.message);
      }
    } finally {
      dispatch(closeLoader());
    }
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setAuthError('');
    dispatch(showLoader());

    try {
      const validatedData: EmailVerifyValues = await verifyEmailSchema.validate(data, {
        abortEarly: false,
      });

      if (!validatedData.verifyCode) {
        setAuthError('Enter verification code');
        return;
      }

      const res = await AuthService.verifyEmail({
        email: validatedData.email,
        verifyCode: validatedData.verifyCode,
      });

      if (!res.success) {
        setAuthError(res.error);
        setData((prev) => ({ ...prev, verifyCode: '' }));
        return;
      }

      dispatch(
        setAuth({
          id: res.data.id,
          email: res.data.email,
          name: res.data.name,
          accessToken: res.data.accessToken,
        }),
      );

      setAccessAction(true);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};

        err.inner.forEach((e) => {
          if (e.path) newErrors[e.path] = e.message;
        });

        setErrors(newErrors);
      } else if (err instanceof Error) {
        setAuthError(err.message);
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
            <h2 className={styles.auth__headerTitle}>Verify Your Email</h2>
            <p className={styles.auth__headerSubtitle}>
              Enter the 6-digit code we sent to your email
            </p>
          </div>

          <form className={styles.auth__form} onSubmit={onSubmitHandler}>
            {fields.map((field) => (
              <Input
                key={field.name}
                formId={formId}
                label={field.label}
                placeholder={field.placeholder}
                name={field.name}
                value={String(data[field.name as keyof DataInterface] ?? '')}
                onChange={onChangeHandler}
                img={field.img}
                authOptions={field.authOptions}
                err={
                  field.name === 'email'
                    ? ((emailError || errors[field.name as keyof FormErrors]) ?? '')
                    : (errors[field.name as keyof FormErrors] ?? '')
                }
                type={field.type !== 'password' ? 'text' : 'password'}
              />
            ))}

            <div className={styles.auth__footer}>
              <p className={styles.auth__signupLink}>
                Code expired?{' '}
                <button
                  disabled={isLoaderShown}
                  type="button"
                  className={styles.auth__button}
                  onClick={resendHandler}
                >
                  Resend
                </button>
              </p>
            </div>

            <AuthButton text="Confirm" disabled={isLoaderShown} type="submit" />
          </form>
        </div>
      </div>

      {authError && <ErrorModal error={authError} onClick={() => setAuthError('')} />}
      {successMessage && (
        <AccessModal onClick={() => setSuccessMessage('')} text={successMessage} />
      )}
      {accessAction && (
        <AccessModal onClick={navigateHandler} text="Your email has been successfully verified" />
      )}
    </div>
  );
};

export default VerifyEmail;
