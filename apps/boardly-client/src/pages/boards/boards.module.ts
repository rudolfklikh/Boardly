import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BoardsService } from '../../entities/board/api/boards.service';
import { BoardsStore } from '../../entities/board/store/boards.store';
import { BoardCardComponent } from '../../entities/board/ui/board-card/board-card.component';
import { BoardsEmptyComponent } from '../../entities/board/ui/boards-empty/boards-empty.component';
import { InlineFormComponent } from '../../features/ui/inline-form/inline-form.component';
import { BoardsRoutingModule } from './boards-routing.module';
import { BoardsComponent } from './boards.component';

@NgModule({
  declarations: [BoardsComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    BoardsRoutingModule,
    InlineFormComponent,
    BoardsEmptyComponent,
    BoardCardComponent
  ],
  providers: [BoardsService, BoardsStore]
})
export class BoardsModule {}
