import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './Auth.module.scss'
import fields from '@utils/fields/updatePasswordFields'
import { Input, AuthButton, ErrorModal } from '@components'
import { bg } from '../../assets'
import passwordUpdateSchema from '@utils/validation/passwordUpdate-validation'
import { useNavigate } from 'react-router-dom'
import AuthService from '@services/authService'
import { Loader } from '@components'

const UpdatePassword = () => {
  const [data, setData] = useState({ email: '', newPassword: '', repeatPassword: '' })
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState()
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
    setAuthError('')
    setErrors({})
    setIsLoading(true)

    try {
      await passwordUpdateSchema.validate(data, { abortEarly: false })

      const res = await AuthService.updatePassword({
        email: data.email,
        newPassword: data.newPassword,
        repeatPassword: data.repeatPassword,
      })

      if (!res.success) {
        setAuthError(res.error)
        setIsErrorModalOpen(true)
        return
      }

      navigate('/login')
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
            <h2 className={styles.auth__headerTitle}>Update Password</h2>
            <p className={styles.auth__headerSubtitle}>Let’s get you back in</p>
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
              />
            ))}

            <div className={styles.auth__footer}>
              <p className={styles.auth__signupLink}>
                Remembered your password? <Link to={'/login'}>Log In</Link>
              </p>
            </div>

            <AuthButton text="Sign Up" />
          </form>
        </div>
      </div>

      {isErrorModalOpen && <ErrorModal error={authError} onClick={openModalHandler} />}
      {isLoading && <Loader />}
    </div>
  )
}

export default UpdatePassword
