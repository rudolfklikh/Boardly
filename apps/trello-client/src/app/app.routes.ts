import { type Routes } from '@angular/router';
import { AUTH_GUARD, HOME_GUARD } from './auth/services/auth.guard.service';

export const appRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes'),
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
