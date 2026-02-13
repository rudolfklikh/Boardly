import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState
} from '@ngrx/signals';
import { delay, finalize, pipe, switchMap, take, tap } from 'rxjs';
import { BoardsService } from '../../../entities/board/api/boards.service';
import { type Board } from '../../../entities/board/model/board.interface';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

interface BoardsState {
  boards: Board[];
  isLoading: boolean;
}

const initialState: Readonly<BoardsState> = {
  boards: [],
  isLoading: false
};

export const BoardsStore = signalStore(
  withState(initialState),
  withMethods((store, boardsService = inject(BoardsService)) => ({
    createBoard$(title: string): void {
      this.updateIsLoading(true);

      boardsService
        .createBoard(title)
        .pipe(
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
    },
    getBoards: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => boardsService.getBoards()),
        take(1),
        tap((boards) => patchState(store, { boards })),
        tap(() => patchState(store, { isLoading: false }))
      )
    )
  })),
  withHooks({
    onInit({ getBoards }) {
      getBoards();
    }
  })
);
