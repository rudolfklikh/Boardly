import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { type CurrentUser } from '../interfaces/current-user.interface';
import { environment } from '../../../environments/environment';
import { type NullOrUndefined } from '../../shared/types/null-or-undefined.type';
import { type RegisterRequest } from '../interfaces/register-request.interface';
import { type LoginRequest } from '../interfaces/login-request.interface';
import { SocketService } from '../../shared/services/socket.service';

@Injectable()
export class AuthService {
  readonly #http = inject(HttpClient);
  readonly #socketService = inject(SocketService);
  readonly #currentUser$ = new BehaviorSubject<CurrentUser | NullOrUndefined>(
    undefined
  );

  /* TODO#1 - remove this vars and move logic to Core Store when all modules are refactored */
  currentUser$ = this.#currentUser$.asObservable();
  isLoggedIn$: Observable<boolean> = this.#currentUser$.pipe(
    filter((currentUser) => currentUser !== undefined),
    map((currentUser) => !!currentUser)
  );

  getCurrentUser(): Observable<CurrentUser> {
    return this.#http.get<CurrentUser>(`${environment.apiUrl}/user`);
  }

  register(
    registerRequest: Readonly<RegisterRequest>
  ): Observable<CurrentUser> {
    return this.#http.post<CurrentUser>(
      `${environment.apiUrl}/users`,
      registerRequest
    );
  }

  login(loginRequest: Readonly<LoginRequest>): Observable<CurrentUser> {
    return this.#http.post<CurrentUser>(
      `${environment.apiUrl}/users/login`,
      loginRequest
    );
  }

  setToken(currentUser: Readonly<CurrentUser>): void {
    localStorage.setItem('token', currentUser.token);
  }

  /* The same as TODO#1 */
  setCurrentUser(currentUser: Readonly<CurrentUser> | null): void {
    this.#currentUser$.next(currentUser);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.#currentUser$.next(null);
    this.#socketService.disconnect();
  }
}
