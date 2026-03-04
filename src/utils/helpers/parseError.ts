import { AxiosError } from 'axios';

const parseError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    return (
      axiosError.response?.data?.error ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      'Error'
    );
  }

  if (error instanceof Error) return error.message;

  return 'Error';
};

export default parseError;
