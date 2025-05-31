import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ColumnsService } from '../../entities/board/api/columns.service';
import { TasksService } from '../../entities/board/api/tasks.service';
import { BoardService } from '../../entities/board/services/board.service';
import { InlineFormComponent } from '../../features/ui/inline-form/inline-form.component';
import { TopbarComponent } from '../../widgets/topbar/topbar.component';
import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';

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
