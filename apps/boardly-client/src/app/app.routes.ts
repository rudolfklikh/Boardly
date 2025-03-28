import { type Routes } from '@angular/router';
import {
  AUTH_GUARD,
  HOME_GUARD
} from '@boardly/shared/services/auth/helpers/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'auth',
        loadChildren: () => import('../pages/auth/auth.routes'),
        canActivate: [AUTH_GUARD]
      },
      {
        path: 'boards',
        loadChildren: () =>
          import('../pages/boards/boards.module').then((m) => m.BoardsModule),
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
