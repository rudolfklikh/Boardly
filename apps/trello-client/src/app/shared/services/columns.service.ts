import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { type Column } from '../interfaces/column.interface';
import { type ColumnInput } from '../interfaces/column-input.interface';
import { SocketService } from './socket.service';
import { SocketEvents } from '../enums/socket-events.enum';

@Injectable()
export class ColumnsService {
  constructor(
    private http: HttpClient,
    private socketService: SocketService
  ) {}

  getColumns(boardId: string): Observable<Column[]> {
    return this.http.get<Column[]>(
      `${environment.apiUrl}/boards/${boardId}/columns`
    );
  }

  createColumn(columnInput: ColumnInput): void {
    this.socketService.emit(SocketEvents.COLUMNS_CREATE, columnInput);
  }

  updateColumnsOrder(columns: Column[]): void {
    this.socketService.emit(SocketEvents.COLUMNS_UPDATE, columns);
  }
}
