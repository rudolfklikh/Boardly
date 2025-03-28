import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { type TaskInput } from '@boardly/entities/board/model/task-input.interface';
import { type Task } from '@boardly/entities/board/model/task.interface';
import { environment } from '@boardly/environments/environment';
import { SocketService } from '@boardly/shared/services/socket/api/socket.service';
import { SocketEvents } from '@boardly/shared/services/socket/model/socket-events.enum';
import { Observable } from 'rxjs';

@Injectable()
export class TasksService {
  readonly #http = inject(HttpClient);
  readonly #socketService = inject(SocketService);

  getTasks(columnId: string): Observable<Task[]> {
    return this.#http.get<Task[]>(
      `${environment.apiUrl}/boards/${columnId}/tasks`
    );
  }

  createTask(taskInput: Readonly<TaskInput>): void {
    this.#socketService.emit(SocketEvents.TASK_CREATE, taskInput);
  }

  updateTasksOrder(
    tasks: Readonly<Task[]>,
    boardId: string,
    columnId: string
  ): void {
    this.#socketService.emit(SocketEvents.TASKS_UPDATE, {
      tasks,
      boardId,
      columnId
    });
  }
}
