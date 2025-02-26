import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { type CurrentUser } from '../interfaces/current-user.interface';
import { type LoginRequest } from '../interfaces/login-request.interface';
import { type RegisterRequest } from '../interfaces/register-request.interface';

@Injectable()
export class AuthService {
  readonly #http = inject(HttpClient);

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
}
