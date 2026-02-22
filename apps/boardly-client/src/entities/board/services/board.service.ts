import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Injectable, signal } from '@angular/core';
import { type Board } from '../../../entities/board/model/board.interface';
import { type Column } from '../../../entities/board/model/column.interface';
import { type Task } from '../../../entities/board/model/task.interface';
import { SocketService } from '../../../shared/services/socket/api/socket.service';
import { SocketEvents } from '../../../shared/services/socket/model/socket-events.enum';

@Injectable()
export class BoardService {
  readonly board = signal<Board | null>(null);
  readonly columns = signal<Column[]>([]);
  readonly #socketService: SocketService;

  setBoard(board: Board): void {
    this.board.set(board);
  }

  setColumns(columns: Column[]): void {
    this.columns.set(columns);
  }

  setTasks(tasks: Task[], columnID: string): void {
    this.columns.update((columns) => {
      const columnIndex = columns.findIndex((col) => col.id === columnID);
      if (columnIndex === -1) return columns;

      return columns.map((col, i) =>
        i === columnIndex ? { ...col, tasks } : col
      );
    });
  }

  addColumn(column: Column): void {
    this.columns.update((columns) => {
      const isColumnExist = columns.some((col) => col.id === column.id);
      return isColumnExist ? columns : [...columns, column];
    });
  }

  addTask(task: Task): void {
    this.columns.update((columns) => {
      const columnIndex = columns.findIndex((col) => col.id === task.columnId);
      if (columnIndex === -1) return columns;

      const column = columns[columnIndex]!;
      const isTaskExist = (column.tasks ?? []).some((t) => t.id === task.id);
      if (isTaskExist) return columns;

      return columns.map((col, i) =>
        i === columnIndex
          ? { ...col, tasks: [...(col.tasks ?? []), task] }
          : col
      );
    });
  }

  updateColumn(column: Column): void {
    this.columns.update((columns) =>
      columns.map((col) => (col.id === column.id ? column : col))
    );
  }

  updateColumnOrder(
    column: Column,
    previousIndex: number,
    currentIndex: number
  ): void {
    this.columns.update((columns) => {
      const columnIndex = columns.findIndex((col) => col.id === column.id);
      if (columnIndex === -1) return columns;

      const updated = [...columns];
      moveItemInArray(updated, previousIndex, currentIndex);
      return updated;
    });
  }

  updateTaskPosition(
    task: Task,
    column: Column,
    previousIndex: number,
    currentIndex: number,
    dropVertically: boolean
  ): void {
    this.columns.update((columns) => {
      const columnIndex = columns.findIndex((col) => col.id === task.columnId);
      if (columnIndex === -1) return columns;

      const tasks = [...(column.tasks ?? [])];

      if (dropVertically) {
        moveItemInArray(tasks, previousIndex, currentIndex);

        return columns.map((col, i) =>
          i === columnIndex ? { ...col, tasks } : col
        );
      }

      const updatedColumnIndex = columns.findIndex(
        (col) => col.id === column.id
      );
      const previousTasks = [...(columns[columnIndex]?.tasks ?? [])];

      transferArrayItem(previousTasks, tasks, previousIndex, currentIndex);

      return columns.map((col, i) => {
        if (i === columnIndex) return { ...col, tasks: previousTasks };
        if (i === updatedColumnIndex) return { ...col, tasks };
        return col;
      });
    });
  }

  leaveBoard(boardId: string): void {
    this.board.set(null);
    this.columns.set([]);

    this.#socketService.emit(SocketEvents.BOARDS_LEAVE, { boardId });
  }
}
