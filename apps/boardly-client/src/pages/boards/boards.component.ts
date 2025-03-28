import {
  Component,
  ElementRef,
  inject,
  viewChild,
  type Signal
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { type Board } from '@boardly/entities/board/model/board.interface';
import { BoardsStore } from '@boardly/entities/board/store/boards.store';
import { CreateBoardComponent } from '@boardly/entities/board/ui/create-board/create-board.component';
import { createBoardConfig } from '@boardly/entities/board/ui/create-board/create-board.config';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
  standalone: false
})
export class BoardsComponent {
  private readonly boardsStore = inject(BoardsStore);
  private readonly dialog = inject(MatDialog);

  protected boards: Signal<Board[] | undefined> = this.boardsStore.boards;
  protected isLoading = this.boardsStore.isLoading;
  protected searchWrapper = viewChild.required<ElementRef>('searchWrapper');

  createBoard(title: string): void {
    this.boardsStore.createBoard$(title);
  }

  protected createNewBoard(): void {
    const dialogRef = this.dialog.open(CreateBoardComponent, createBoardConfig);

    dialogRef
      .afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe((title) => this.createBoard(title));
  }
}
