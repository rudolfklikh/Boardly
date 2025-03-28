import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { type Board } from '@boardly/entities/board/model/board.interface';
import { environment } from '@boardly/environments/environment';
import { Observable } from 'rxjs';

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
