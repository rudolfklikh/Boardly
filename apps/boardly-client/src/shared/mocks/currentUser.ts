import type { CurrentUser } from '../interfaces/current-user.interface';

export const mockCurrentUser = {
  email: 'mock@gmail.com',
  id: 'mockID',
  token: 'mockToken',
  username: 'MockUserName'
} satisfies CurrentUser;
