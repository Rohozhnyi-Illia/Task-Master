import React, { useState, useRef, useEffect } from 'react'
import * as styles from './CategorySelect.module.scss'

const CustomSelect = ({
  options = [],
  label = 'Select category',
  onChange,
  selected,
  setSelected,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  const toggleOpen = () => setIsOpen(!isOpen)

  const handleSelect = (option) => {
    setSelected(option)
    setIsOpen(false)
    onChange?.(option)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className={styles.select} ref={selectRef} id={id}>
      <div
        className={`${styles.select__trigger} ${isOpen ? styles.open : ''}`}
        onClick={toggleOpen}
      >
        <span>{selected || label}</span>
        <div className={styles.select__arrow}></div>
      </div>

      {isOpen && (
        <ul className={styles.select__options}>
          {options.map((opt) => (
            <li
              key={opt}
              className={`${styles.select__option} ${opt === selected ? styles.active : ''}`}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CustomSelect
