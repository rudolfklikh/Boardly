import type { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import type { CurrentUser } from '@boardly/shared/interfaces/current-user.interface';
import {
  AuthService,
  type LoginPayload,
  type RegisterPayload
} from '@boardly/shared/services/auth';
import { SocketService } from '@boardly/shared/services/socket/api/socket.service';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withHooks,
  withMethods,
  withProps,
  withState
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

interface CoreState {
  currentUser: CurrentUser | null;
}

const initialState: Readonly<CoreState> = {
  currentUser: null
};

export function withPropsAndOnAuthHook() {
  return signalStoreFeature(
    withProps(() => ({
      _authService: inject(AuthService),
      _socketService: inject(SocketService),
      _router: inject(Router)
    })),
    withMethods((store) => ({
      _setupUserOnAuth: (currentUser: Readonly<CurrentUser>) => {
        patchState(store, { currentUser });
        store._authService.setToken(currentUser);
        store._socketService.setupSocketConnection(currentUser);
        store._router.navigate(['/']);
      }
    }))
  );
}

export const CoreStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withPropsAndOnAuthHook(),
  withMethods((store) => ({
    loginIn: rxMethod<LoginPayload>(
      pipe(
        switchMap(({ payload, errorCallback }) =>
          store._authService.login(payload).pipe(
            tapResponse(
              (currentUser) => {
                store._setupUserOnAuth(currentUser);
              },
              (err: HttpErrorResponse) => {
                errorCallback(err);
              }
            )
          )
        )
      )
    ),
    registerUser: rxMethod<RegisterPayload>(
      pipe(
        switchMap(({ payload, errorCallback }) =>
          store._authService.register(payload).pipe(
            tapResponse(
              (user) => {
                store._setupUserOnAuth(user);
              },
              (err: HttpErrorResponse) => {
                errorCallback(err);
              }
            )
          )
        )
      )
    ),
    logout(): void {
      localStorage.removeItem('token');
      patchState(store, { currentUser: null });
      store._socketService.disconnect();
    }
  })),
  withHooks({
    onInit: (store) => {
      rxMethod<void>(
        pipe(
          switchMap(() =>
            store._authService.getCurrentUser().pipe(
              tapResponse(
                (currentUser) => {
                  patchState(store, { currentUser });
                  store._socketService.setupSocketConnection(currentUser);
                },
                () => {
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
