import React from 'react'
import * as styles from './Input.module.scss'
import { Link } from 'react-router-dom'
import ErrorMessage from '../ErrorMessage/ErrorMessage'

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
  } = props

  return (
    <div className={styles.input}>
      <label htmlFor={name} className={styles.input__label}>
        {label}
      </label>

      <div className={styles.input__wrapper}>
        {img && <img src={img} alt={`${name} icon`} className={styles.input__img} />}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          name={name}
          className={styles.input__input}
        />
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
