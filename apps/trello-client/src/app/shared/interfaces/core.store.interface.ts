import type { CurrentUser } from '../../auth/interfaces/current-user.interface';

export interface CoreState {
  currentUser: CurrentUser | null;
}
