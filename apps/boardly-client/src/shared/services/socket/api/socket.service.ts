import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import type { CurrentUser } from '../../../../shared/interfaces/current-user.interface';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  #socket: Socket | undefined;

  setupSocketConnection(currentUser: Readonly<CurrentUser>): void {
    this.#socket = io(`${environment.socketUrl}`, {
      auth: {
        token: currentUser.token
      }
    });
  }

  disconnect(): void {
    if (!this.#socket) {
      throw new Error('Socket connection is not established');
    }

    this.#socket.disconnect();
  }

  emit(eventName: string, message: unknown): void {
    if (!this.#socket) {
      throw new Error('Socket connection is not established');
    }

    this.#socket.emit(eventName, message);
  }

  listen<T>(eventName: string): Observable<T> {
    if (!this.#socket) {
      throw new Error('Socket connection is not established');
    }

    return new Observable((subcriber) => {
      this.#socket?.on(eventName, (data) => {
        subcriber.next(data);
      });
    });
  }
}
