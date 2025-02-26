import {
  HttpHandler,
  HttpRequest,
  type HttpEvent,
  type HttpInterceptor
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: Readonly<HttpRequest<unknown>>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');

    const reqClone = req.clone({
      setHeaders: {
        Authorization: token ? `Bearer ${token}` : []
      }
    });

    return next.handle(reqClone);
  }
}
