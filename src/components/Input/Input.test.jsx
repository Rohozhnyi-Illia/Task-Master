import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Input from './Input'
import { describe, test, expect, jest } from '@jest/globals'

jest.mock('./Input.module.scss', () => new Proxy({}, { get: (_, key) => key }))
jest.mock('../ErrorMessage/ErrorMessage', () => ({ error }) => (
  <p data-testid="error-msg">{error}</p>
))

describe('Input Component', () => {
  const baseProps = {
    label: 'Email',
    placeholder: 'Enter your email',
    name: 'email',
    img: '../../assets/images/mail.png',
    onChange: jest.fn(),
    value: '',
  }

  test('renders label and placeholder', () => {
    render(<Input {...baseProps} />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
  })

  test('renders image with correct alt and src', () => {
    render(<Input {...baseProps} />)
    const img = screen.getByAltText('email icon')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '../../assets/images/mail.png')
  })

  test('calls onChange when input value changes', () => {
    render(<Input {...baseProps} />)
    const input = screen.getByPlaceholderText('Enter your email')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    expect(baseProps.onChange).toHaveBeenCalledTimes(1)
  })

  test('renders ErrorMessage when err prop is passed', () => {
    render(<Input {...baseProps} err="Incorrect Email" />)
    expect(screen.getByTestId('error-msg')).toHaveTextContent('Incorrect Email')
  })
})
