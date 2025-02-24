import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import type { CoreState } from '../interfaces/core.store.interface';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { SocketService } from '../services/socket.service';
import type { CurrentUser } from '../../auth/interfaces/current-user.interface';

const initialState: CoreState = {
  currentUser: null
};

export const CoreStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      socketService = inject(SocketService)
    ) => ({
      loadCurrentUser: rxMethod<void>(
        pipe(
          switchMap(() =>
            authService.getCurrentUser().pipe(
              tapResponse(
                (currentUser: Readonly<CurrentUser>) => {
                  patchState(store, { currentUser });
                  authService.setCurrentUser(currentUser);
                  socketService.setupSocketConnection(currentUser);
                },
                () => {
                  authService.setCurrentUser(null);
                  patchState(store, { currentUser: null });
                }
              )
            )
          )
        )
      )
    })
  )
);
