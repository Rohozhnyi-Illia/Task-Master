import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';
import { MemoryRouter } from 'react-router-dom';

describe('Input component', () => {
  const defaultProps = {
    label: 'Email',
    placeholder: 'Enter email',
    onChange: jest.fn(),
    value: '',
    name: 'email',
    err: '',
    type: 'text',
    formId: 'test-form',
  } as const;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders label and input', () => {
    render(<Input {...defaultProps} />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  test('calls onChange when typing', async () => {
    render(<Input {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter email');

    await userEvent.type(input, 'test');

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  test('displays error message', () => {
    render(<Input {...defaultProps} err="Error occurred" />);

    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  test('applies error class when err exists', () => {
    render(<Input {...defaultProps} err="Error" />);

    const input = screen.getByPlaceholderText('Enter email');
    expect(input.className).toMatch(/error/);
  });

  test('renders icon when img is provided', () => {
    render(<Input {...defaultProps} img="icon.png" />);

    expect(screen.getByAltText('email icon')).toBeInTheDocument();
  });

  test('toggles password visibility', async () => {
    render(<Input {...defaultProps} type="password" name="password" label="Password" />);

    const input = screen.getByLabelText('Password');
    const button = screen.getByRole('button', { name: /show password/i });

    expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(button);

    expect(input).toHaveAttribute('type', 'text');

    await userEvent.click(button);

    expect(input).toHaveAttribute('type', 'password');
  });

  test('renders auth options when enabled', () => {
    render(
      <MemoryRouter>
        <Input {...defaultProps} authOptions />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText('Keep me logged in')).toBeInTheDocument();
    expect(screen.getByText('Forget your password?')).toBeInTheDocument();
  });

  test('checkbox reflects checkValue', () => {
    render(
      <MemoryRouter>
        <Input {...defaultProps} authOptions checkValue />
      </MemoryRouter>,
    );

    const checkbox = screen.getByLabelText('Keep me logged in');
    expect(checkbox).toBeChecked();
  });

  test('calls onChange when checkbox changes', async () => {
    render(
      <MemoryRouter>
        <Input {...defaultProps} authOptions />
      </MemoryRouter>,
    );

    const checkbox = screen.getByLabelText('Keep me logged in');

    await userEvent.click(checkbox);

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  test('generates correct input id and associates label', () => {
    render(<Input {...defaultProps} />);

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'test-form-email');
  });
});
