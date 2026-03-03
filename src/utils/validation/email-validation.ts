import * as yup from 'yup';

const emailSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
});

export type EmailValue = yup.InferType<typeof emailSchema>;

export default emailSchema;
