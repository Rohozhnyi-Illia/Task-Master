import { AxiosError } from 'axios';

const parseError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;

    const msg =
      axiosError.response?.data?.error ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      'Error';

    return msg.replace(/^Error:\s*/, '');
  }

  if (error instanceof Error) return error.message.replace(/^Error:\s*/, '');

  return 'Error';
};

export default parseError;
