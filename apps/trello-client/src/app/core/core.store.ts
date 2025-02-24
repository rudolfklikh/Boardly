import { patchState, signalStore, withHooks, withState } from '@ngrx/signals';
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
  withHooks({
    onInit: (store) => {
      const authService = inject(AuthService);
      const socketService = inject(SocketService);
      rxMethod<void>(
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
      )();
    }
  })
);
