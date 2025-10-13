import { mdiPassword, mail } from '../../assets'

const FIELDS = [
  {
    label: 'E-Mail',
    name: 'email',
    placeholder: 'Enter Your Email...',
    img: mail,
  },
  {
    label: 'Password',
    name: 'password',
    placeholder: 'Enter Your Password...',
    img: mdiPassword,
    authOptions: true,
  },
]

export default FIELDS
