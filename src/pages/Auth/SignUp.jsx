import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './Auth.module.scss'
import fields from '@utils/fields/signUpFields'
import { Input, AuthButton } from '@components'
import { bg } from '@assets'
import signUpSchema from '@utils/validation/signUp-validation'
import { ErrorModal, AccessModal } from '@components'
import AuthService from '@services/authService'
import { useNavigate } from 'react-router-dom'
import { Loader } from '@components'
import { useDispatch } from 'react-redux'
import { updateEmail } from '@store/authSlice'

const SignUp = () => {
  const [data, setData] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [accessAction, setAccessAction] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const openModalHandler = () => {
    setIsErrorModalOpen(!isErrorModalOpen)
  }

  const navigateHandler = () => {
    navigate('/verify-email', { replace: true })
    setAccessAction(false)
    return
  }

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setErrors({})
    setAuthError('')

    try {
      setIsLoading(true)
      await signUpSchema.validate(data, { abortEarly: false })

      const res = await AuthService.register({
        email: data.email,
        password: data.password,
        name: data.name,
      })

      if (!res.success) {
        setAuthError(res.error)
        openModalHandler()
        return
      }

      sessionStorage.setItem('signUpEmail', res.data.email)
      dispatch(updateEmail(res.data.email))
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
        openModalHandler()
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
            <h2 className={styles.auth__headerTitle}>Sign Up</h2>
            <p className={styles.auth__headerSubtitle}>Let’s get started</p>
          </div>

          <form className={styles.auth__form} onSubmit={onSubmitHandler}>
            {fields.map((field) => (
              <Input
                key={field.name}
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
                Already have an account? <Link to={'/login'}>Log In</Link>
              </p>
            </div>

            <AuthButton text="Sign Up" disabled={isLoading} />
          </form>
        </div>
      </div>

      {isErrorModalOpen && authError && (
        <ErrorModal error={authError} onClick={openModalHandler} />
      )}

      {accessAction && (
        <AccessModal
          text={'An email activation code has been sent to your email address.'}
          onClick={navigateHandler}
        />
      )}

      {isLoading && <Loader />}
    </div>
  )
}

export default SignUp
