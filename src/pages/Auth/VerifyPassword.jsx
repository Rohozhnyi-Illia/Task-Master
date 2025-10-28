import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './Auth.module.scss'
import fields from '@utils/fields/verifyPasswordFields'
import { Input, AuthButton, ErrorModal, AccessModal } from '@components'
import { bg } from '@assets'
import passwordVerifySchema from '@utils/validation/passwordVerify-validation'
import { useNavigate } from 'react-router-dom'
import AuthService from '@services/authService'
import { Loader } from '@components'
import { useSelector } from 'react-redux'

const VerifyPassword = () => {
  const [data, setData] = useState({
    newPassword: '',
    repeatPassword: '',
    verifyCode: '',
  })
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState()
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [accessAction, setAccessAction] = useState(false)

  const navigate = useNavigate()

  const email = useSelector((state) => state.auth.email)

  const openModalHandler = () => {
    setIsErrorModalOpen(!isErrorModalOpen)
    return
  }

  const navigateHandler = () => {
    setAccessAction(false)
    navigate('/login', { replace: true })
    return
  }

  useEffect(() => {
    if (!email && !accessAction) {
      navigate('/update-password', { replace: true })
    }
  }, [email, accessAction, navigate])

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setAuthError('')
    setErrors({})
    setIsLoading(true)

    try {
      await passwordVerifySchema.validate(data, { abortEarly: false })

      const res = await AuthService.verifyPassword({
        email,
        newPassword: data.newPassword,
        repeatPassword: data.repeatPassword,
        verifyCode: data.verifyCode,
      })

      if (!res.success) {
        setAuthError(res.error)
        openModalHandler()
        setAccessAction(false)

        setTimeout(() => {
          navigate('/update-password', { replace: true })
        }, 3000)
        return
      }

      if (res.success) {
        setAccessAction(true)
      }
    } catch (err) {
      if (err.inner) {
        const newErrors = {}
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message
        })
        setErrors(newErrors)
      } else {
        setAuthError(err.message)
        setIsErrorModalOpen(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

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
                label={field.label}
                placeholder={field.placeholder}
                name={field.name}
                value={data[field.name] ?? ''}
                onChange={onChangeHandler}
                img={field.img}
                authOptions={field.authOptions}
                err={errors[field.name]}
                type={field.type !== 'password' ? 'text' : 'password'}
              />
            ))}

            <div className={styles.auth__footer}>
              <p className={styles.auth__signupLink}>
                Remembered your password? <Link to={'/login'}>Log In</Link>
              </p>
            </div>

            <AuthButton text="Update" />
          </form>
        </div>
      </div>

      {isErrorModalOpen && <ErrorModal error={authError} onClick={openModalHandler} />}
      {isLoading && <Loader />}
      {accessAction && (
        <AccessModal onClick={navigateHandler} text={'Password successfully changed'} />
      )}
    </div>
  )
}

export default VerifyPassword
