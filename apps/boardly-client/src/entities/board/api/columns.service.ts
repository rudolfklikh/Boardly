import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { type ColumnInput } from '../../../entities/board/model/column-input.interface';
import { type Column } from '../../../entities/board/model/column.interface';
import { environment } from '../../../environments/environment';
import { SocketService } from '../../../shared/services/socket/api/socket.service';
import { SocketEvents } from '../../../shared/services/socket/model/socket-events.enum';

@Injectable()
export class ColumnsService {
  #http = inject(HttpClient);
  #socketService = inject(SocketService);

  getColumns(boardId: string): Observable<Column[]> {
    return this.#http.get<Column[]>(
      `${environment.apiUrl}/boards/${boardId}/columns`
    );
  }

  createColumn(columnInput: Readonly<ColumnInput>): void {
    this.#socketService.emit(SocketEvents.COLUMNS_CREATE, columnInput);
  }

  updateColumnsOrder(columns: Readonly<Column[]>): void {
    this.#socketService.emit(SocketEvents.COLUMNS_UPDATE, columns);
  }
}
