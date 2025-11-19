import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './Auth.module.scss'
import fields from '@utils/fields/updatePasswordFields'
import { Input, AuthButton, ErrorModal, AccessModal } from '@components'
import { bg } from '../../assets'
import passwordUpdateSchema from '@utils/validation/passwordUpdate-validation'
import { useNavigate } from 'react-router-dom'
import AuthService from '@services/authService'
import { Loader } from '@components'
import { useDispatch } from 'react-redux'
import { updateEmail } from '@store/authSlice'

const UpdatePassword = () => {
  const [data, setData] = useState({ email: '' })
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
    navigate('/verify-password', { replace: true })
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
    setAuthError('')
    setErrors({})
    setIsLoading(true)

    try {
      await passwordUpdateSchema.validate(data, { abortEarly: false })

      const res = await AuthService.updatePassword({
        email: data.email,
      })

      if (!res.success) {
        setAuthError(res.error)
        openModalHandler()
        return
      }

      dispatch(updateEmail(data.email))
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
                type={field.type || 'text'}
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
        <AccessModal
          text={'The code to change your password has been sent to your email address.'}
          onClick={navigateHandler}
        />
      )}
    </div>
  )
}

export default UpdatePassword
