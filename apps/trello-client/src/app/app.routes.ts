import { type Routes } from '@angular/router';
import { AUTH_GUARD, HOME_GUARD } from './auth/services/auth.guard.service';
import { CoreStore } from './shared/store/core.store';

export const appRoutes: Routes = [
  {
    path: '',
    providers: [CoreStore],
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
        canActivate: [AUTH_GUARD]
      },
      {
        path: 'boards',
        loadChildren: () =>
          import('./boards/boards.module').then((m) => m.BoardsModule),
        canActivate: [HOME_GUARD]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'boards'
      }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'boards'
  }
];
