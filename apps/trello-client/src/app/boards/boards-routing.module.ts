import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { BoardsComponent } from './components/boards/boards.component';
import { HOME_GUARD } from '../auth/services/auth.guard.service';

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
