import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearError } from '@store/UI/errorSlice'
import ErrorModal from '../ErrorModal/ErrorModal'
import { RootState } from '@store/store'

const GlobalErrorModal = () => {
  const dispatch = useDispatch()
  const error = useSelector((state: RootState) => state.error.error)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(clearError())
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])

  if (!error) return null

  return <ErrorModal error={error} onClick={() => dispatch(clearError())} />
}

export default GlobalErrorModal
