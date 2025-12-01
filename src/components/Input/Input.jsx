import React, { useState } from 'react'
import * as styles from './Input.module.scss'
import { Link } from 'react-router-dom'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import { IoIosEye, IoMdEyeOff } from 'react-icons/io'

const Input = (props) => {
  const {
    label,
    placeholder,
    onChange,
    value,
    name,
    img,
    authOptions = false,
    err,
    checkValue,
    type = 'text',
    formId,
  } = props

  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password'

  const inputId = `${formId}-${name}`

  const changePasswordTypeHandler = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={styles.input}>
      <label htmlFor={inputId} className={styles.input__label}>
        {label}
      </label>

      <div className={styles.input__wrapper}>
        {img && <img src={img} alt={`${name} icon`} className={styles.input__img} />}

        <input
          id={inputId}
          type={isPasswordField && showPassword ? 'text' : type}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          name={name}
          className={`${styles.input__input} ${err ? styles.error : ''}`}
        />

        {isPasswordField && (
          <button
            className={styles.input__typeButton}
            type="button"
            onClick={changePasswordTypeHandler}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <IoMdEyeOff /> : <IoIosEye />}
          </button>
        )}
      </div>

      {err && <ErrorMessage error={err} />}

      {authOptions && (
        <div className={styles.input__options}>
          <div className={styles.input__check}>
            <input
              id="keepLogged"
              type="checkbox"
              name="keepLogged"
              onChange={onChange}
              checked={!!checkValue}
            />
            <label htmlFor="keepLogged">Keep me logged in</label>
          </div>

          <Link className={styles.input__link} to={'/update-password'}>
            Forget your password?
          </Link>
        </div>
      )}
    </div>
  )
}

export default Input
