import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './Auth.module.scss'
import fields from '../../utils/fields/signUpFields'
import { Input, AuthButton } from '../../components'
import { bg } from '../../assets'
import signUpSchema from '../../utils/validation/sign-up-validation'

const SignUp = () => {
  const [data, setData] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      await signUpSchema.validate(data, { abortEarly: false })
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
                value={data[field.name]}
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
    </div>
  )
}

export default SignUp
