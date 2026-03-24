import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Auth.module.scss';
import fields from '@utils/fields/signUpFields';
import { bg } from '@assets/index';
import signUpSchema from '@utils/validation/signUp-validation';
import { ErrorModal, AccessModal, Input, AuthButton } from '@components/index';
import AuthService from '@services/authService';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateEmail } from '@store/authSlice';
import { showLoader, closeLoader } from '@store/UI/loaderSlice';
import { RootState } from '@store/store';
import { SignUpValues } from '@utils/validation/signUp-validation';
import * as yup from 'yup';

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
};

interface DataInterface {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const [data, setData] = useState<DataInterface>({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState<string>('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [accessAction, setAccessAction] = useState<boolean>(false);
  const isLoaderShown: boolean = useSelector((state: RootState) => state.loader.isLoaderShown);

  const formId = 'signUp';

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openModalHandler = () => {
    setIsErrorModalOpen(!isErrorModalOpen);
  };

  const navigateHandler = () => {
    navigate('/verify-email', { replace: true });
    setAccessAction(false);
    return;
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setAuthError('');
    dispatch(showLoader());

    try {
      const validatedData: SignUpValues = await signUpSchema.validate(data, {
        abortEarly: false,
      });

      const res = await AuthService.register({
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      });

      if (!res.success) {
        setAuthError(res.error);
        openModalHandler();
        return;
      }

      sessionStorage.setItem('signUpEmail', res.data.email);
      dispatch(updateEmail(res.data.email));
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
        openModalHandler();
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
            <h2 className={styles.auth__headerTitle}>Sign Up</h2>
            <p className={styles.auth__headerSubtitle}>Let’s get started</p>
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
                err={String(errors[field.name as keyof FormErrors] ?? '')}
                type={field.type !== 'password' ? 'text' : 'password'}
              />
            ))}

            <div className={styles.auth__footer}>
              <p className={styles.auth__signupLink}>
                Already have an account? <Link to={'/login'}>Log In</Link>
              </p>
            </div>

            <AuthButton text="Sign Up" disabled={isLoaderShown} type="submit" />
          </form>
        </div>
      </div>

      {isErrorModalOpen && authError && <ErrorModal error={authError} onClick={openModalHandler} />}

      {accessAction && (
        <AccessModal
          text={'An email activation code has been sent to your email address.'}
          onClick={navigateHandler}
        />
      )}
    </div>
  );
};

export default SignUp;
