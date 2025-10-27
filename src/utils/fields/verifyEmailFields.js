import { mail, verify } from '../../assets'

const FIELDS = [
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
]

export default FIELDS
