import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { CoreStore } from '../../core/core.store';

export const HOME_GUARD: CanActivateFn = () => {
  const { currentUser } = inject(CoreStore);
  const router = inject(Router);

  if (!currentUser()) {
    router.navigate(['/auth']);
    return false;
  }

  return true;
};

export const AUTH_GUARD: CanActivateFn = () => {
  const router = inject(Router);
  const { currentUser } = inject(CoreStore);

  if (currentUser()) {
    router.navigate(['/boards']);
    return false;
  }
  return true;
};
