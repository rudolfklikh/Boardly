import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

export const HOME_GUARD: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      }

      router.navigate(['/auth']);
      return false;
    })
  );
};

export const AUTH_GUARD: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        return true;
      }

      router.navigate(['/boards']);
      return false;
    })
  );
};
