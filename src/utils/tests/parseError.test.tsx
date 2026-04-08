import parseError from '../helpers/parseError';
import { AxiosError } from 'axios';

describe('parseError', () => {
  test('returns axios response.data.error if exists', () => {
    const error = {
      response: { data: { error: 'Server error!' } },
      message: 'ignored',
    } as AxiosError;
    expect(parseError(error)).toBe('Server error!');
  });

  test('returns axios response.data.message if error missing', () => {
    const error = {
      response: { data: { message: 'Something went wrong' } },
      message: 'ignored',
    } as AxiosError;
    expect(parseError(error)).toBe('Something went wrong');
  });

  test('returns axios error.message if no response.data', () => {
    const error = {
      response: undefined,
      message: 'Network failed',
    } as AxiosError;
    expect(parseError(error)).toBe('Network failed');
  });

  test('returns regular Error message', () => {
    const error = new Error('Normal error');
    expect(parseError(error)).toBe('Normal error');
  });

  test('returns default "Error" for unknown types', () => {
    expect(parseError('oops')).toBe('Error');
    expect(parseError(null)).toBe('Error');
    expect(parseError(undefined)).toBe('Error');
  });

  test('removes "Error: " prefix', () => {
    const error = new Error('Error: Something wrong');
    expect(parseError(error)).toBe('Something wrong');
  });
});
