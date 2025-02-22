import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import { BoardRoutingModule } from './board-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BoardService } from './services/board.service';
import { ColumnsService } from '../shared/services/columns.service';
import { TopbarComponent } from '../shared/components/topbar/topbar.component';
import { InlineFormComponent } from '../shared/components/inline-form/inline-form.component';
import { TasksService } from '../shared/services/tasks.service';

@NgModule({
  declarations: [BoardComponent],
  imports: [
    CommonModule,
    BoardRoutingModule,
    DragDropModule,
    TopbarComponent,
    InlineFormComponent
  ],
  providers: [BoardService, ColumnsService, TasksService]
})
export class BoardModule {}
