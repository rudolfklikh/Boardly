import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { AUTH_GUARD, HOME_GUARD } from './auth/services/auth.guard.service';

const routes: Routes = [
  {
    path: '',
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
