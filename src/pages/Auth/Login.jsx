import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as styles from './Auth.module.scss'
import fields from '@utils/fields/loginFields'
import { bg } from '@assets'
import loginSchema from '@utils/validation/login-validation'
import emailSchema from '@utils/validation/email-validation'
import { Input, AuthButton, ErrorModal } from '@components'
import { useDispatch, useSelector } from 'react-redux'
import { setAuth, updateEmail } from '@store/authSlice'
import AuthService from '@services/authService'
import { showLoader, closeLoader } from '@store/UI/loaderSlice'
import useTheme from '../../hooks/useTheme'

const Login = () => {
  useTheme()

  const [data, setData] = useState({
    email: '',
    password: '',
    keepLogged: false,
  })
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [isAccountActivated, setIsAccountActivated] = useState(true)
  const isLoaderShown = useSelector((state) => state.loader.isLoaderShown)

  const formId = 'login'

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const openModalHandler = () => setIsErrorModalOpen(!isErrorModalOpen)

  const onChangeHandler = (e) => {
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
    const savedAuth = JSON.parse(localStorage.getItem('authState'))

    if (savedAuth?.keepLogged && savedAuth?.accessToken) {
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
      await emailSchema.validate({ email: data.email }, { abortEarly: false })

      const res = await AuthService.reVerifyEmail(data.email)

      if (!res.success) {
        setAuthError(res.error)
        openModalHandler()
        return
      }

      dispatch(updateEmail(data.email))
      navigate('/verify-email')
    } catch (err) {
      if (err.inner) {
        err.inner.forEach((e) => {
          if (e.path === 'email') setEmailError(e.message)
        })
      } else {
        setAuthError(err.message)
        setIsErrorModalOpen(true)
      }
    } finally {
      dispatch(closeLoader())
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setErrors({})
    setAuthError('')
    dispatch(showLoader())

    try {
      await loginSchema.validate(data, { abortEarly: false })

      const res = await AuthService.login({
        email: data.email,
        password: data.password,
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
        isAuth: true,
        keepLogged: !!data.keepLogged,
      }

      dispatch(setAuth(authState))

      if (data.keepLogged) {
        localStorage.setItem('authState', JSON.stringify(authState))
      }

      navigate('/application')
    } catch (err) {
      if (err.inner) {
        const newErrors = {}
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message
        })
        setErrors(newErrors)
      } else {
        setAuthError(err.message || 'Something went wrong')
        setIsErrorModalOpen(true)
      }
    } finally {
      dispatch(closeLoader())
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
                value={data[field.name] ?? ''}
                onChange={onChangeHandler}
                img={field.img}
                authOptions={field.authOptions}
                err={
                  field.name === 'email'
                    ? emailError || errors[field.name]
                    : errors[field.name]
                }
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

              <AuthButton text="Log In" disabled={isLoaderShown} />
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
