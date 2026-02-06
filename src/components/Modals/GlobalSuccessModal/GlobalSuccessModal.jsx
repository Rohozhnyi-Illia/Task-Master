import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearSuccess } from '@store/successSlice'
import AccessModal from '../AcessModal/AcessModal'

const GlobalSuccessModal = () => {
  const dispatch = useDispatch()
  const message = useSelector((state) => state.success.message)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        dispatch(clearSuccess())
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])

  if (!message) return null

  return <AccessModal text={message} onClick={() => dispatch(clearSuccess())} />
}

export default GlobalSuccessModal
