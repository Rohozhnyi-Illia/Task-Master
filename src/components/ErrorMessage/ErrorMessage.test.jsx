import React from 'react'
import { render, screen } from '@testing-library/react'
import ErrorMessage from './ErrorMessage'

test('Error message render', () => {
  const errorText = 'Error test'
  render(<ErrorMessage error={errorText} />)
  expect(screen.getByText('Error test')).toBeInTheDocument()
})
