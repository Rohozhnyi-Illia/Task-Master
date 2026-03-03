import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Auth.module.scss'
import fields from '@utils/fields/loginFields'
import { bg } from '@assets/index'
import loginSchema, { LoginFormValues } from '@utils/validation/login-validation'
import emailSchema from '@utils/validation/email-validation'
import { Input, AuthButton, ErrorModal } from '@components/index'
import { useDispatch, useSelector } from 'react-redux'
import { setAuth, updateEmail } from '@store/authSlice'
import AuthService from '@services/authService'
import { showLoader, closeLoader } from '@store/UI/loaderSlice'
import useTheme from '../../hooks/useTheme'
import { RootState } from '@store/store'
import { AuthState } from '../../types/auth'
import { EmailValue } from '@utils/validation/email-validation'
import * as yup from 'yup'

type FormErrors = {
  email?: string
  password?: string
  keepLogged?: boolean
}

interface DataInterface {
  email: string
  password: string
  keepLogged: boolean
}

const Login = () => {
  useTheme()

  const [data, setData] = useState<DataInterface>({
    email: '',
    password: '',
    keepLogged: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [authError, setAuthError] = useState<string>('')
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<string>('')
  const [isAccountActivated, setIsAccountActivated] = useState<boolean>(true)
  const isLoaderShown: boolean = useSelector((state: RootState) => state.loader.isLoaderShown)

  const formId: string = 'login'

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const openModalHandler = () => setIsErrorModalOpen(!isErrorModalOpen)

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const navigateHandler = () => {
    navigate('/verify-email')
    setIsAccountActivated(true)
    return
  }

  useEffect(() => {
    const raw = localStorage.getItem('authState')
    if (!raw) return

    let savedAuth: AuthState | null = null

    try {
      savedAuth = JSON.parse(raw)
    } catch (error) {
      localStorage.removeItem('authState')
      return
    }

    if (savedAuth?.keepLogged && savedAuth?.accessToken) {
      dispatch(showLoader())
      dispatch(setAuth(savedAuth))
      navigate('/application')
    } else if (savedAuth?.email) {
      setData((prev) => ({
        ...prev,
        email: savedAuth.email,
        keepLogged: true,
      }))
    }
  }, [dispatch, navigate])

  const activateHandler = async () => {
    setErrors({})
    setAuthError('')
    setEmailError('')
    dispatch(showLoader())

    try {
      const validatedData: EmailValue = await emailSchema.validate(
        { email: data.email },
        { abortEarly: false },
      )

      const res = await AuthService.reVerifyEmail(validatedData.email)

      if (!res.success) {
        setAuthError(res.error)
        openModalHandler()
        return
      }

      dispatch(updateEmail(validatedData.email))
      navigate('/verify-email')
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {}

        err.inner.forEach((e) => {
          if (e.path) {
            newErrors[e.path] = e.message
          }
        })

        setErrors(newErrors)
      } else if (err instanceof Error) {
        setAuthError(err.message)
        setIsErrorModalOpen(true)
      }
    } finally {
      dispatch(closeLoader())
    }
  }

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setAuthError('')
    dispatch(showLoader())

    let isSuccess

    try {
      const validatedData: LoginFormValues = await loginSchema.validate(data, {
        abortEarly: false,
      })

      const res = await AuthService.login({
        email: validatedData.email,
        password: validatedData.password,
      })

      if (!res.success) {
        if (res.error === 'Email not activated') {
          await AuthService.reVerifyEmail(data.email)
          setAuthError('Your email is not verified. Please check your inbox.')
          openModalHandler()
          setIsAccountActivated(false)
          dispatch(updateEmail(data.email))
          return
        }

        setAuthError(res.error || 'Login failed')
        setIsErrorModalOpen(true)
        return
      }

      const authState = {
        id: res.data.id,
        email: res.data.email,
        name: res.data.name,
        accessToken: res.data.accessToken,
        keepLogged: !!data.keepLogged,
      }

      dispatch(setAuth(authState))

      if (data.keepLogged) {
        localStorage.setItem('authState', JSON.stringify(authState))
      }

      isSuccess = true
      navigate('/application')
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {}

        err.inner.forEach((e) => {
          if (e.path) newErrors[e.path] = e.message
        })

        setErrors(newErrors)
      } else if (err instanceof Error) {
        setAuthError(err.message)
        setIsErrorModalOpen(true)
      }
    } finally {
      if (!isSuccess) {
        dispatch(closeLoader())
      }
    }
  }

  return (
    <div className={styles.auth} style={{ backgroundImage: `url(${bg})` }}>
      <div className={styles.auth__container}>
        <div className={styles.auth__container_wrapper}>
          <div className={styles.auth__header}>
            <h2 className={styles.auth__headerTitle}>Login</h2>
            <p className={styles.auth__headerSubtitle}>
              Keep track of your tasks and organize your day easily.
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
                err={String(
                  field.name === 'email'
                    ? ((emailError || errors[field.name as keyof FormErrors]) ?? '')
                    : (errors[field.name as keyof FormErrors] ?? ''),
                )}
                checkValue={data.keepLogged}
                type={field.type !== 'password' ? 'text' : 'password'}
              />
            ))}

            <div className={styles.auth__footerWrapper}>
              <div className={styles.auth__footer}>
                <p className={styles.auth__signupLink}>
                  Don’t have an account? <Link to={'/sign-up'}>Sign up</Link>
                </p>
              </div>

              <div className={styles.auth__footer}>
                <p className={styles.auth__signupLink}>
                  Account not activated?
                  <button
                    disabled={isLoaderShown}
                    type="button"
                    className={styles.auth__button}
                    onClick={activateHandler}
                  >
                    Activate
                  </button>
                </p>
              </div>

              <AuthButton text="Log In" disabled={isLoaderShown} type="submit" />
            </div>
          </form>
        </div>
      </div>

      {authError && isErrorModalOpen && (
        <ErrorModal
          error={authError}
          onClick={isAccountActivated ? openModalHandler : navigateHandler}
        />
      )}
    </div>
  )
}

export default Login
