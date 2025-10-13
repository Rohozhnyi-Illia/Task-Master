import { mdiPassword, mail } from '../../assets'

const FIELDS = [
  {
    label: 'E-Mail',
    name: 'email',
    placeholder: 'Enter Your Email...',
    img: mail,
  },
  {
    label: 'New Password',
    name: 'newPassword',
    placeholder: 'Enter New Password...',
    img: mdiPassword,
  },
  {
    label: 'Repeat Password',
    name: 'repeatPassword',
    placeholder: 'Repeat Your Password...',
    img: mdiPassword,
  },
]

export default FIELDS
