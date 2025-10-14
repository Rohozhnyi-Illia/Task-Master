import React from 'react'
import { render, screen } from '@testing-library/react'
import AuthButton from './AuthButton'

test('Button render', () => {
  const text = 'Test Text'
  render(<AuthButton text={text} />)
  expect(screen.getByText('Test Text')).toBeInTheDocument()
})
