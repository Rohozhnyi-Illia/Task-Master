import React, { useEffect, useState } from 'react'
import * as styles from './Auth.module.scss'
import fields from '@utils/fields/verifyEmailFields'
import { Input, AuthButton } from '@components'
import { bg } from '@assets'
import verifyEmailSchema from '@utils/validation/emailVerify-validation'
import emailSchema from '@utils/validation/email-validation'
import { ErrorModal, AccessModal } from '@components'
import { setAuth } from '@store/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import AuthService from '@services/authService'
import { useNavigate } from 'react-router-dom'
import { showLoader, closeLoader } from '@store/UI/loaderSlice'

const VerifyEmail = () => {
  const [data, setData] = useState({ email: '', verifyCode: '' })
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [accessAction, setAccessAction] = useState(false)
  const [emailError, setEmailError] = useState('')
  const email = useSelector((state) => state.auth.email)
  const isLoaderShown = useSelector((state) => state.loader.isLoaderShown)

  const formId = 'verifyEmail'

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const emailFromSession = sessionStorage.getItem('signUpEmail')
    if (!email && !emailFromSession) {
      navigate('/login', { replace: true })
      return
    } else if (emailFromSession) {
      setData((prev) => ({ ...prev, email: emailFromSession }))
    }
  }, [email, navigate])

  const navigateHandler = () => {
    setAccessAction(false)
    sessionStorage.removeItem('signUpEmail')
    navigate('/application', { replace: true })
    return
  }

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const resendHandler = async () => {
    setErrors({})
    setAuthError('')
    setSuccessMessage('')
    dispatch(showLoader())

    try {
      await emailSchema.validate({ email: data.email }, { abortEarly: false })

      if (!data.email) {
        setAuthError('Enter your email address')
        return
      }

      const res = await AuthService.reVerifyEmail(data.email)

      if (res.success) {
        setSuccessMessage('A new verification code has been sent to your email.')
      } else {
        setAuthError(res.error || 'Something went wrong')
      }
    } catch (err) {
      if (err.inner) {
        err.inner.forEach((e) => {
          if (e.path === 'email') setEmailError(e.message)
        })
      } else {
        setAuthError(err.message || 'Something went wrong')
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
      await verifyEmailSchema.validate(data, { abortEarly: false })

      if (!data.verifyCode) {
        setAuthError('Enter verification code')
        return
      }

      const res = await AuthService.verifyEmail({
        email: data.email,
        verifyCode: data.verifyCode,
      })

      if (!res.success) {
        setAuthError(res.error)
        setData((prev) => ({ ...prev, verifyCode: '' }))
        return
      }

      dispatch(
        setAuth({
          id: res.data.id,
          email: res.data.email,
          name: res.data.name,
          accessToken: res.data.accessToken,
          isAuth: true,
        }),
      )

      setAccessAction(true)
    } catch (err) {
      if (err.inner) {
        const newErrors = {}
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message
        })
        setErrors(newErrors)
      } else {
        setAuthError(err.message)
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
                value={data[field.name] ?? ''}
                onChange={onChangeHandler}
                img={field.img}
                authOptions={field.authOptions}
                err={
                  field.name === 'email'
                    ? emailError || errors[field.name]
                    : errors[field.name]
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

            <AuthButton text="Confirm" disabled={isLoaderShown} />
          </form>
        </div>
      </div>

      {authError && <ErrorModal error={authError} onClick={() => setAuthError('')} />}
      {successMessage && (
        <AccessModal onClick={() => setSuccessMessage('')} text={successMessage} />
      )}
      {accessAction && <AccessModal onClick={navigateHandler} />}
    </div>
  )
}

export default VerifyEmail
