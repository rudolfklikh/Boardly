import { Component, inject, output } from '@angular/core';
import { type AnimationOptions, LottieDirective } from 'ngx-lottie';
import { MatDialog } from '@angular/material/dialog';
import { CreateBoardComponent } from '../create-board/create-board.component';
import { createBoardConfig } from '../create-board/create-board.config';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-boards-empty',
  standalone: true,
  imports: [LottieDirective],
  templateUrl: './boards-empty.component.html',
  styleUrl: './boards-empty.component.scss'
})
export class BoardsEmptyComponent {
  private readonly dialog = inject(MatDialog);
  protected readonly boardCreation = output<string>();
  protected readonly lottieAnimationOptions: AnimationOptions = {
    path: 'assets/no-data.json'
  };

  protected createNewBoard(): void {
    const dialogRef = this.dialog.open(CreateBoardComponent, createBoardConfig);

    dialogRef
      .afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe((title) => this.boardCreation.emit(title));
  }
}
