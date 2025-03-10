import { Injectable } from '@angular/core';
import {
  type HttpEvent,
  HttpHandler,
  type HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    req = req.clone({
      setHeaders: {
        Authorization: token ? `Bearer ${token}` : []
      }
    });

    return next.handle(req);
  }
}
