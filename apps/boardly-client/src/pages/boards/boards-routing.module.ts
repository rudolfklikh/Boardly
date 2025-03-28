import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { HOME_GUARD } from '@boardly/shared/services/auth/helpers/auth.guard';
import { BoardsComponent } from './boards.component';

const routes: Routes = [
  {
    path: '',
    component: BoardsComponent
  },
  {
    path: ':boardId',
    loadChildren: () =>
      import('../board/board.module').then((m) => m.BoardModule),
    canActivate: [HOME_GUARD]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardsRoutingModule {}
