import React, { useLayoutEffect } from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import * as styles from './DropdownPortal.module.scss'

const DropdownPortal = ({ isOpen, anchorRef, options, onSelect, onClose }) => {
  const dropdownRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })

  useLayoutEffect(() => {
    if (!isOpen || !anchorRef.current) return

    const rectangle = anchorRef.current.getBoundingClientRect()

    setPos({
      top: rectangle.top + window.scrollY - 150,
      left: rectangle.left + window.scrollX,
      width: rectangle.width,
    })
  }, [isOpen, anchorRef])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose, anchorRef])

  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  }, [onClose, anchorRef])

  if (!isOpen) return null

  return createPortal(
    <div
      ref={dropdownRef}
      className={styles.dropdown}
      style={{
        top: pos.top,
        left: pos.left,
        width: pos.width,
        position: 'absolute',
        zIndex: 9999,
      }}
    >
      {options.map((option) => (
        <div
          key={option}
          className={styles.option}
          onClick={() => {
            onSelect(option)
            onClose()
          }}
        >
          {option}
        </div>
      ))}
    </div>,
    document.body,
  )
}

export default DropdownPortal
