import { type Routes } from '@angular/router';
import { BoardsComponent } from './boards.component';

const routes: Routes = [
  {
    path: '',
    component: BoardsComponent
  },
  {
    path: ':boardId',
    loadChildren: () => import('../board/board.routes')
  }
];

export default routes;
