import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './Auth.module.scss'
import fields from '../../utils/fields/loginFields'
import { Input, AuthButton } from '../../components'
import { bg } from '../../assets'
import loginSchema from '../../utils/validation/sign-up-validation'
import ErrorModal from '../../components/ErrorModal/ErrorModal'

const Login = () => {
  const [data, setData] = useState({ email: '', password: '', keepLogged: false })
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('User already exist')

  const openModalHandler = () => {
    setIsErrorModalOpen(!isErrorModalOpen)
  }

  const onChangeHandler = (e) => {
    const { name, value, type, checked } = e.target
    setData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      openModalHandler()
      await loginSchema.validate(data, { abortEarly: false })
      setErrors({})
    } catch (err) {
      const newErrors = {}
      err.inner.forEach((e) => {
        newErrors[e.path] = e.message
      })
      setErrors(newErrors)
    }

    return
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
                label={field.label}
                placeholder={field.placeholder}
                name={field.name}
                value={data[field.name]}
                onChange={onChangeHandler}
                img={field.img}
                authOptions={field.authOptions}
                err={errors[field.name]}
              />
            ))}

            <div className={styles.auth__footer}>
              <p className={styles.auth__signupLink}>
                Don’t have an account? <Link to={'/sign-up'}>Sign up</Link>
              </p>
            </div>

            <AuthButton text="Log In" />
          </form>
        </div>
      </div>

      {isErrorModalOpen && <ErrorModal err={authError} onClick={openModalHandler} />}
    </div>
  )
}

export default Login
