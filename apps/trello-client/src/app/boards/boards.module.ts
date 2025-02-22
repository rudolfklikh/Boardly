import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BoardsRoutingModule } from './boards-routing.module';
import { BoardsComponent } from './components/boards/boards.component';
import { BoardsService } from '../shared/services/boards.service';
import { InlineFormComponent } from '../shared/components/inline-form/inline-form.component';
import { BoardsEmptyComponent } from './components/boards-empty/boards-empty.component';
import { BoardCardComponent } from './components/boards/board-card/board-card.component';
import { BoardsStore } from './data-access/boards.store';

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
