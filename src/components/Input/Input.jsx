import React from 'react'
import * as styles from './Input.module.scss'
import { Link } from 'react-router-dom'
import ErrorMessage from '../ErrorMessage/ErrorMessage'

//Test plug
// const Link = ({ children }) => <>{children}</>

const Input = (props) => {
  const { label, placeholder, onChange, value, name, img, authOptions = false, err } = props
  return (
    <div className={styles.input}>
      <label htmlFor={name} className={styles.input__label}>
        {label}
      </label>

      <div className={styles.input__wrapper}>
        <img src={img} alt={`${name} icon`} className={styles.input__img} />
        <input
          id={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          name={name}
          className={styles.input__input}
        />
      </div>

      {ErrorMessage && <ErrorMessage error={err} />}

      {authOptions && (
        <div className={styles.input__options}>
          <div className={styles.input__check}>
            <input type="checkbox" name="keepLogged" onChange={onChange} />
            <label htmlFor="keepLoged">Keep me logged in</label>
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
