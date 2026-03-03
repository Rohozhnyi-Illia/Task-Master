import React, { ChangeEvent, FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Auth.module.scss'
import fields from '@utils/fields/updatePasswordFields'
import { Input, AuthButton, ErrorModal, AccessModal } from '@components/index'
import { bg } from '../../assets'
import passwordUpdateSchema from '@utils/validation/passwordUpdate-validation'
import { useNavigate } from 'react-router-dom'
import AuthService from '@services/authService'
import { useDispatch, useSelector } from 'react-redux'
import { updateEmail } from '@store/authSlice'
import { showLoader, closeLoader } from '@store/UI/loaderSlice'
import { RootState } from '@store/store'
import { EmailValue } from '@utils/validation/email-validation'
import * as yup from 'yup'

type FormErrors = {
  email?: string
}

interface DataInterface {
  email: string
}

const UpdatePassword = () => {
  const [data, setData] = useState<DataInterface>({ email: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [authError, setAuthError] = useState<string>('')
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false)
  const [accessAction, setAccessAction] = useState<boolean>(false)
  const isLoaderShown: boolean = useSelector((state: RootState) => state.loader.isLoaderShown)

  const formId: string = 'updatePassword'

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

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAuthError('')
    setErrors({})
    dispatch(showLoader())

    try {
      const validatedData: EmailValue = await passwordUpdateSchema.validate(data, {
        abortEarly: false,
      })

      const res = await AuthService.updatePassword({
        email: validatedData.email,
      })

      if (!res.success) {
        setAuthError(res.error)
        openModalHandler()
        return
      }

      sessionStorage.setItem('resetEmail', validatedData.email)
      dispatch(updateEmail(validatedData.email))
      setAccessAction(true)
    } catch (err) {
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
      dispatch(closeLoader())
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
                formId={formId}
                label={field.label}
                placeholder={field.placeholder}
                name={field.name}
                value={String(data[field.name as keyof DataInterface] ?? '')}
                onChange={onChangeHandler}
                img={field.img}
                authOptions={field.authOptions}
                err={String(errors[field.name as keyof FormErrors] ?? '')}
                type={field.type || 'text'}
              />
            ))}

            <div className={styles.auth__footer}>
              <p className={styles.auth__signupLink}>
                Remembered your password? <Link to={'/login'}>Log In</Link>
              </p>
            </div>

            <AuthButton text="Update" disabled={isLoaderShown} type="submit" />
          </form>
        </div>
      </div>

      {isErrorModalOpen && <ErrorModal error={authError} onClick={openModalHandler} />}
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
