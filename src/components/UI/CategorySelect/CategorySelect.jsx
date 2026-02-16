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
    onChange?.(option)
    setIsOpen(false)
    selectRef.current.focus()
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

  const firstOptionRef = useRef(null)

  useEffect(() => {
    if (isOpen && firstOptionRef.current) {
      firstOptionRef.current.focus()
    }
  })
  const keyDownHandler = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleOpen()
    }

    if (e.key === 'Escape') {
      setIsOpen(false)
      selectRef.current?.focus()
    }
  }

  const optionKeyDownHandler = (e, option) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect(option)
      selectRef.current?.focus()
    }
  }

  return (
    <div className={styles.select} id={id} onKeyDown={keyDownHandler}>
      <div
        className={`${styles.select__trigger} ${isOpen ? styles.open : ''}`}
        onClick={toggleOpen}
        tabIndex={0}
        ref={selectRef}
      >
        <span>{selected || label}</span>
        <div className={styles.select__arrow}></div>
      </div>

      {isOpen && (
        <ul className={styles.select__options}>
          {options.map((opt, index) => (
            <li
              key={opt}
              className={`${styles.select__option} ${opt === selected ? styles.active : ''}`}
              onClick={() => handleSelect(opt)}
              tabIndex={0}
              onKeyDown={(e) => optionKeyDownHandler(e, opt)}
              ref={index === 0 ? firstOptionRef : null}
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
