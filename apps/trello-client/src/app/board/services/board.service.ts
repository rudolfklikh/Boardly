import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketEvents } from '../../shared/enums/socket-events.enum';
import { type Board } from '../../shared/interfaces/board.interface';
import { type Column } from '../../shared/interfaces/column.interface';
import { type Task } from '../../shared/interfaces/task.interface';
import { SocketService } from '../../shared/services/socket.service';

@Injectable()
export class BoardService {
  board$ = new BehaviorSubject<Board | null>(null);
  columns$ = new BehaviorSubject<Column[]>([]);

  constructor(private socketService: SocketService) {}

  setBoard(board: Board): void {
    this.board$.next(board);
  }

  setColumns(columns: Column[]): void {
    this.columns$.next(columns);
  }

  setTasks(tasks: Task[], columnID: string): void {
    const columnIndex = this.columns$
      .getValue()
      .findIndex((col) => col.id === columnID);

    if (columnIndex !== -1) {
      const updatedColumn = this.columns$.getValue()[columnIndex];
      const columns = [...this.columns$.getValue()];

      columns.splice(columnIndex, 1, { ...updatedColumn!, tasks });

      this.columns$.next(columns);
    }
  }

  addColumn(column: Column): void {
    const columns = [...(this.columns$.getValue() ?? [])];
    const isColumnExist = !!columns.find((col) => col.id === column.id);

    if (!isColumnExist) {
      this.columns$.next([...this.columns$.getValue(), column]);
    }
  }

  addTask(task: Task): void {
    const columnIndx = this.columns$
      .getValue()
      .findIndex((col) => col.id === task.columnId);

    if (columnIndx !== -1) {
      const updatedColumn = this.columns$.getValue()[columnIndx];
      const columns = [...this.columns$.getValue()];
      const tasks = [...(updatedColumn!.tasks ?? [])];
      const isTaskExist = !!tasks.find((t) => t.id === task.id);

      if (!isTaskExist) {
        columns.splice(columnIndx, 1, {
          ...updatedColumn!,
          tasks: [...(updatedColumn!.tasks ?? []), task]
        });
        this.columns$.next(columns);
      }
    }
  }

  updateColumn(column: Column): void {
    const columns = [...(this.columns$.getValue() ?? [])];
    const columnIndex = columns.findIndex((col) => col.id === column.id);

    columns.splice(columnIndex, 1, column);

    this.columns$.next(columns);
  }

  updateColumnOrder(
    column: Column,
    previousIndex: number,
    currentIndex: number
  ): void {
    const columns = [...(this.columns$.getValue() ?? [])];
    const columnIndex = columns.findIndex((col) => col.id === column.id);

    if (columnIndex !== -1) {
      moveItemInArray(columns, previousIndex, currentIndex);

      this.columns$.next(columns);
    }
  }

  updateTaskPosition(
    task: Task,
    column: Column,
    previousIndex: number,
    currentIndex: number,
    dropVertically: boolean
  ): void {
    const columns = [...(this.columns$.getValue() ?? [])];
    const columnIndex = columns.findIndex((col) => col.id === task.columnId);
    const tasks = [...(column.tasks ?? [])];

    if (dropVertically && columnIndex !== -1) {
      moveItemInArray(tasks, previousIndex, currentIndex);

      const updatedColumn = { ...column, tasks: tasks };
      columns.splice(columnIndex, 1, updatedColumn);

      this.columns$.next(columns);
    } else if (!dropVertically && columnIndex !== -1) {
      const updatedColumnIndex = columns.findIndex(
        (col) => col.id === column.id
      );
      const previousTasks = columns[columnIndex]?.tasks ?? [];

      transferArrayItem(previousTasks, tasks, previousIndex, currentIndex);

      const updatedColumn = { ...column, tasks: tasks };
      const updatedPreviousColumn = {
        ...columns[columnIndex],
        tasks: previousTasks
      };

      columns.splice(columnIndex, 1, updatedPreviousColumn as any);
      columns.splice(updatedColumnIndex, 1, updatedColumn);

      this.columns$.next(columns);
    }
  }

  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.columns$.next([]);

    this.socketService.emit(SocketEvents.BOARDS_LEAVE, { boardId });
  }
}
