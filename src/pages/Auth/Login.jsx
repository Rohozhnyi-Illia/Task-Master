import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './Auth.module.scss'
import fields from '../../utils/fields/loginFields'
import { Input, AuthButton } from '../../components'
import { bg } from '../../assets'
import loginSchema from '../../utils/validation/login-validation'
import ErrorModal from '../../components/ErrorModal/ErrorModal'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AuthService from '../../services/authService'
import { Loader } from '../../components'
import { setAuth } from '../../store/authSlice'

const Login = () => {
  const [data, setData] = useState({ email: '', password: '', keepLogged: false })
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

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

  useEffect(() => {
    const savedAuth = JSON.parse(localStorage.getItem('authState'))
    if (savedAuth) {
      setData((prevData) => ({
        ...prevData,
        email: savedAuth.email,
        keepLogged: true,
      }))
    }
  }, [])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setErrors({})
    setAuthError('')
    setIsLoading(true)

    try {
      await loginSchema.validate(data, { abortEarly: false })

      const res = await AuthService.login({
        email: data.email,
        password: data.password,
      })

      console.log(res)

      if (!res.success) {
        setAuthError(res.error || 'Something went wrong')
        openModalHandler()
        return
      }

      const authState = {
        id: res.data.id,
        email: res.data.email,
        name: res.data.name,
        accessToken: res.data.accessToken,
        isAuth: true,
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
                value={data[field.name] ?? ''}
                onChange={onChangeHandler}
                img={field.img}
                authOptions={field.authOptions}
                err={errors[field.name]}
                checkValue={data.keepLogged}
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

      {authError && isErrorModalOpen && (
        <ErrorModal error={authError} onClick={openModalHandler} />
      )}
      {isLoading && <Loader />}
    </div>
  )
}

export default Login
