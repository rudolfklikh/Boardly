import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { type ColumnInput } from '@boardly/entities/board/model/column-input.interface';
import { type Column } from '@boardly/entities/board/model/column.interface';
import { environment } from '@boardly/environments/environment';
import { SocketService } from '@boardly/shared/services/socket/api/socket.service';
import { SocketEvents } from '@boardly/shared/services/socket/model/socket-events.enum';
import { Observable } from 'rxjs';

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
