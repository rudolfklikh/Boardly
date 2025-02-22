import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { type CurrentUser } from '../interfaces/current-user.interface';
import { environment } from '../../../environments/environment';
import { type NullOrUndefined } from '../../shared/types/null-or-undefined.type';
import { type RegisterRequest } from '../interfaces/register-request.interface';
import { type LoginRequest } from '../interfaces/login-request.interface';
import { SocketService } from '../../shared/services/socket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly #socketService = inject(SocketService);
  private _currentUser$ = new BehaviorSubject<CurrentUser | NullOrUndefined>(
    undefined
  );

  currentUser$ = this._currentUser$.asObservable();
  isLoggedIn$: Observable<boolean> = this._currentUser$.pipe(
    filter((currentUser) => currentUser !== undefined),
    map((currentUser) => !!currentUser)
  );

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${environment.apiUrl}/user`);
  }

  register(registerRequest: RegisterRequest): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(
      `${environment.apiUrl}/users`,
      registerRequest
    );
  }

  login(loginRequest: LoginRequest): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(
      `${environment.apiUrl}/users/login`,
      loginRequest
    );
  }

  setToken(currentUser: CurrentUser): void {
    localStorage.setItem('token', currentUser.token);
  }

  setCurrentUser(currentUser: CurrentUser | null): void {
    this._currentUser$.next(currentUser);
  }

  logout(): void {
    localStorage.removeItem('token');
    this._currentUser$.next(null);
    this.#socketService.disconnect();
  }
}
