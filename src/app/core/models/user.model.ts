export interface User {
  id?: number,
  username: string,
  email: string,
  password: string,
  role: 'admin' | 'trainer' | 'participant'
}
