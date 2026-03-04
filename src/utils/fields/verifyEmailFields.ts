import { mail, verify } from '../../assets';
import { Field } from '../../types/forms';

const FIELDS: Field[] = [
  {
    label: 'E-Mail',
    name: 'email',
    placeholder: 'Enter Your Email...',
    img: mail,
  },
  {
    label: 'Verify Code',
    name: 'verifyCode',
    placeholder: 'Enter Verify Code...',
    img: verify,
  },
];

export default FIELDS;
