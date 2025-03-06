import { type Routes } from '@angular/router';

const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth.component').then((c) => c.AuthComponent)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

export default authRoutes;
