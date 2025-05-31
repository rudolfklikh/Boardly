import {
  Component,
  ElementRef,
  inject,
  viewChild,
  type Signal
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, take } from 'rxjs';
import { type Board } from '../../entities/board/model/board.interface';
import { BoardsStore } from '../../entities/board/store/boards.store';
import { CreateBoardComponent } from '../../entities/board/ui/create-board/create-board.component';
import { createBoardConfig } from '../../entities/board/ui/create-board/create-board.config';

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
