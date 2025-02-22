import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState
} from '@ngrx/signals';
import { Observable, delay, finalize, take } from 'rxjs';
import { type Board } from '../../shared/interfaces/board.interface';
import { BoardsService } from '../../shared/services/boards.service';

type BoardsState = {
  boards: Board[];
  isLoading: boolean;
};

const initialState: BoardsState = {
  boards: [],
  isLoading: false
};

export const BoardsStore = signalStore(
  withState(initialState),
  withMethods((store, boardsService = inject(BoardsService)) => ({
    getBoards$(): Observable<Board[]> {
      return boardsService.getBoards().pipe(take(1));
    },
    createBoard$(title: string): void {
      this.updateIsLoading(true);

      boardsService
        .createBoard(title)
        .pipe(
          take(1),
          delay(500),
          finalize(() => this.updateIsLoading(false))
        )
        .subscribe((board) => this.patchBoards([board]));
    },
    updateIsLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },
    setBoards(boards: Board[]) {
      patchState(store, { boards });
    },
    patchBoards(boards: Board[]) {
      patchState(store, { boards: [...store.boards(), ...boards] });
    }
  })),
  withHooks({
    onInit({ updateIsLoading, getBoards$, setBoards }) {
      updateIsLoading(true);

      getBoards$()
        .pipe(
          take(1),
          finalize(() => updateIsLoading(false))
        )
        .subscribe((boards) => setBoards(boards));
    }
  })
);
