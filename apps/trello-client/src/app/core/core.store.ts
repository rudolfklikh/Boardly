import {
  patchState,
  signalStore,
  withHooks,
  withProps,
  withState
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import type { CoreState } from '../shared/interfaces/core.store.interface';
import type { CurrentUser } from '../auth/interfaces/current-user.interface';
import { AuthService } from '../auth/services/auth.service';
import { SocketService } from '../shared/services/socket.service';

const initialState: CoreState = {
  currentUser: null
};

export const CoreStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    authService: inject(AuthService),
    socketService: inject(SocketService)
  })),
  withHooks({
    onInit: (store) => {
      rxMethod<void>(
        pipe(
          switchMap(() =>
            store.authService.getCurrentUser().pipe(
              tapResponse(
                (currentUser: Readonly<CurrentUser>) => {
                  patchState(store, { currentUser });
                  store.authService.setCurrentUser(currentUser);
                  store.socketService.setupSocketConnection(currentUser);
                },
                () => {
                  store.authService.setCurrentUser(null);
                  patchState(store, { currentUser: null });
                }
              )
            )
          )
        )
      )();
    }
  })
);
