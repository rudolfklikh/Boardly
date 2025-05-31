import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { type Board } from '../../../entities/board/model/board.interface';
import { environment } from '../../../environments/environment';

@Injectable()
export class BoardsService {
  #http = inject(HttpClient);

  getBoards(): Observable<Board[]> {
    return this.#http.get<Board[]>(`${environment.apiUrl}/boards`);
  }

  getBoard(boardId: string): Observable<Board> {
    return this.#http.get<Board>(`${environment.apiUrl}/boards/${boardId}`);
  }

  createBoard(title: string): Observable<Board> {
    return this.#http.post<Board>(`${environment.apiUrl}/boards`, { title });
  }
}
