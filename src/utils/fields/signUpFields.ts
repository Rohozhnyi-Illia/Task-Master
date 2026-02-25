import { mdiPassword, mail } from '../../assets'
import { Field } from '../../types/forms'

const FIELDS: Field[] = [
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
