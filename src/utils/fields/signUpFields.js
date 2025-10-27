import { mdiPassword, mail } from '../../assets'

const FIELDS = [
  {
    label: 'Name',
    name: 'name',
    placeholder: 'Enter Your Name...',
    img: mail,
  },
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
    type: 'password',
  },
]

export default FIELDS
