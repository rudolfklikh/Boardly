import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SocketService } from './socket.service';
import { SocketEvents } from '../enums/socket-events.enum';
import { type Task } from '../interfaces/task.interface';
import { type TaskInput } from '../interfaces/task-input.interface';
import { environment } from '../../../environments/environment';

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

  updateTasksOrder(tasks: Task[], boardId: string, columnId: string): void {
    this.#socketService.emit(SocketEvents.TASKS_UPDATE, {
      tasks,
      boardId,
      columnId
    });
  }
}
