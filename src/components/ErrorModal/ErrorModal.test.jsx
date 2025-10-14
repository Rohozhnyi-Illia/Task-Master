import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Modal from './ErrorModal'

jest.mock('../AuthButton/AuthButton', () => ({ text, onClick }) => (
  <button onClick={onClick}>{text}</button>
))

describe('ErrorModal', () => {
  const mockOnClick = jest.fn()
  const errorMessage = 'Something went wrong!'

  beforeEach(() => {
    mockOnClick.mockClear()
  })

  test('renders error title and message', () => {
    render(<Modal err={errorMessage} onClick={mockOnClick} />)

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  test('renders error image', () => {
    render(<Modal err={errorMessage} onClick={mockOnClick} />)

    const image = screen.getByAltText('modal icon')
    expect(image).toBeInTheDocument()
    expect(image.tagName).toBe('IMG')
  })

  test('calls onClick when "Try again" is clicked', () => {
    render(<Modal err={errorMessage} onClick={mockOnClick} />)

    const button = screen.getByText('Try again')
    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
