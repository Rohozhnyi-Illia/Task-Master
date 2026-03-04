export interface Field {
  label: string;
  name: string;
  placeholder: string;
  img: string;
  type?: 'text' | 'password' | 'email';
  authOptions?: boolean;
}
