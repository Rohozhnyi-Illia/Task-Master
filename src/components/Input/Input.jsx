import React from 'react'
import * as styles from './Input.module.scss'
import { Link } from 'react-router-dom'

const Input = (props) => {
  const { label, placeholder, onChange, value, name, img, authOptions = false } = props
  return (
    <div className={styles.input}>
      <label htmlFor={name} className={styles.input__label}>
        {label}
      </label>

      <div className={styles.input__wrapper}>
        <img src={img} alt={`${name} icon`} className={styles.input__img} />
        <input
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          name={name}
          className={styles.input__input}
        />
      </div>
      {authOptions && (
        <div className={styles.input__options}>
          <div className={styles.input__check}>
            <input type="checkbox" name="keepLogged" onChange={onChange} />
            <label htmlFor="keepLoged">Keep me logged in</label>
          </div>

          <a href="#" className={styles.input__link}>
            Forget your password?
          </a>
        </div>
      )}
    </div>
  )
}

export default Input
