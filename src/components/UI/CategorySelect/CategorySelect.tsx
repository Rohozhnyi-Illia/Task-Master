import React, { useState, useRef, useEffect } from 'react'
import styles from './CategorySelect.module.scss'

interface CategorySelectProps<T extends string> {
  options: readonly T[]
  label?: string
  selected: T | undefined
  onChange?: (value: T) => void
  id?: string
}

const CategorySelect = <T extends string>({
  options,
  label = 'Select',
  selected,
  onChange,
  id,
}: CategorySelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)
  const firstOptionRef = useRef<HTMLLIElement>(null)

  const toggleOpen = () => setIsOpen(!isOpen)

  const handleSelect = (option: T) => {
    if (onChange) onChange(option)
    setIsOpen(false)
    selectRef.current?.focus()
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && firstOptionRef.current) {
      firstOptionRef.current.focus()
    }
  })

  const keyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleOpen()
    }

    if (e.key === 'Escape') {
      setIsOpen(false)
      selectRef.current?.focus()
    }
  }

  const optionKeyDownHandler = (e: React.KeyboardEvent<HTMLLIElement>, option: T) => {
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

export default CategorySelect
