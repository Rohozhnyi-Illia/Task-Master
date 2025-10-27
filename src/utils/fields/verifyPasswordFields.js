import { mdiPassword, verify } from '../../assets'

const FIELDS = [
  {
    label: 'Verify Code',
    name: 'verifyCode',
    placeholder: 'Enter Verify Code...',
    img: verify,
  },
  {
    label: 'New Password',
    name: 'newPassword',
    placeholder: 'Enter New Password...',
    img: mdiPassword,
    type: 'password',
  },
  {
    label: 'Repeat Password',
    name: 'repeatPassword',
    placeholder: 'Repeat Your Password...',
    img: mdiPassword,
    type: 'password',
  },
]

export default FIELDS
