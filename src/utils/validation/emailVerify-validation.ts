import * as yup from 'yup';

const emailVerifySchema = yup.object().shape({
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),

  verifyCode: yup
    .string()
    .trim()
    .matches(/^[A-Za-z0-9]{6}$/, 'Verification code must be exactly 6 letters or numbers')
    .required('Verification code is required'),
});

export type EmailVerifyValues = yup.InferType<typeof emailVerifySchema>;

export default emailVerifySchema;
