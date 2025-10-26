import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './Auth.module.scss'
import fields from '@utils/fields/signUpFields'
import { Input, AuthButton } from '@components'
import { bg } from '@assets'
import signUpSchema from '@utils/validation/sign-up-validation'
import { ErrorModal } from '@components'
import { setAuth } from '@store/authSlice'
import { useDispatch } from 'react-redux'
import AuthService from '@services/authService'
import { useNavigate } from 'react-router-dom'
import { Loader } from '@components'

const SignUp = () => {
  const [data, setData] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const openModalHandler = () => {
    setIsErrorModalOpen(!isErrorModalOpen)
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
        setIsErrorModalOpen(true)
        return
      }

      dispatch(
        setAuth({
          id: res.data.id,
          email: res.data.email,
          name: res.data.name,
          accessToken: res.data.accessToken,
        })
      )

      navigate('/application')
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
              />
            ))}

            <div className={styles.auth__footer}>
              <p className={styles.auth__signupLink}>
                Already have an account? <Link to={'/login'}>Log In</Link>
              </p>
            </div>

            <AuthButton text="Sign Up" />
          </form>
        </div>
      </div>

      {isErrorModalOpen && authError && (
        <ErrorModal error={authError} onClick={openModalHandler} />
      )}

      {isLoading && <Loader />}
    </div>
  )
}

export default SignUp
