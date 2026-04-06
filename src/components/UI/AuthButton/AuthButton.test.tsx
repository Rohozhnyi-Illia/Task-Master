import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthButton from './AuthButton';

describe('AuthButton', () => {
  test('renders button with text', () => {
    render(<AuthButton text="Login" type="submit" />);

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('has correct type attribute', () => {
    render(<AuthButton text="Click" type="button" />);

    const button = screen.getByTestId('auth-button');
    expect(button).toHaveAttribute('type', 'button');
  });

  test('calls onClick when clicked', async () => {
    const handleClick = jest.fn();

    render(<AuthButton text="Click" type="button" onClick={handleClick} />);

    const button = screen.getByTestId('auth-button');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is true', () => {
    render(<AuthButton text="Click" type="button" disabled />);

    const button = screen.getByTestId('auth-button');
    expect(button).toBeDisabled();
  });

  test('is enabled by default', () => {
    render(<AuthButton text="Click" type="button" />);

    const button = screen.getByTestId('auth-button');
    expect(button).not.toBeDisabled();
  });

  test('does not call onClick when disabled', async () => {
    const handleClick = jest.fn();

    render(<AuthButton text="Click" type="button" onClick={handleClick} disabled />);

    const button = screen.getByTestId('auth-button');
    await userEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
