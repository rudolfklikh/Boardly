import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ColumnsService } from '@boardly/entities/board/api/columns.service';
import { TasksService } from '@boardly/entities/board/api/tasks.service';
import { BoardService } from '@boardly/entities/board/services/board.service';
import { InlineFormComponent } from '@boardly/features/ui/inline-form/inline-form.component';
import { TopbarComponent } from '@boardly/widgets/topbar/topbar.component';
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
