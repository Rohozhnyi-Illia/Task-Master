import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from './Header'
import useTheme from '../../hooks/useTheme'

jest.mock('../../hooks/useTheme')

jest.mock('../../assets', () => ({
  home: 'home.png',
  notification: 'notification.png',
  stats: 'stats.png',
  sun: 'sun.png',
  moon: 'moon.png',
  exit: 'exit.png',
}))

describe('Header', () => {
  const mockSetTheme = jest.fn()

  beforeEach(() => {
    mockSetTheme.mockClear()
    useTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    })
  })

  test('renders header title and icons', () => {
    render(<Header />)

    expect(screen.getByText('TaskMaster')).toBeInTheDocument()

    expect(screen.getByAltText('notifications')).toBeInTheDocument()
    expect(screen.getByAltText('sun')).toBeInTheDocument()
    expect(screen.getByAltText('moon')).toBeInTheDocument()
    expect(screen.getByAltText('logout')).toBeInTheDocument()
  })

  test('theme toggle calls setTheme on click', () => {
    render(<Header />)
    const toggle = screen.getByTestId('theme-toggle')
    fireEvent.click(toggle)
    expect(mockSetTheme).toHaveBeenCalledTimes(1)
  })

  test('burger menu is in the document', () => {
    render(<Header />)
    const burger = screen.getByRole('button', { name: /menu toggle/i })
    expect(burger).toBeInTheDocument()
  })
})
