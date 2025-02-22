import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import {
  Observable,
  combineLatest,
  concatMap,
  filter,
  forkJoin,
  from,
  map,
  switchMap,
  take,
  tap
} from 'rxjs';
import { type Board } from '../../../shared/interfaces/board.interface';
import { BoardsService } from '../../../shared/services/boards.service';
import { BoardService } from '../../services/board.service';
import { SocketService } from '../../../shared/services/socket.service';
import { SocketEvents } from '../../../shared/enums/socket-events.enum';
import { ColumnsService } from '../../../shared/services/columns.service';
import { type Column } from '../../../shared/interfaces/column.interface';
import { type ColumnInput } from '../../../shared/interfaces/column-input.interface';
import { TasksService } from '../../../shared/services/tasks.service';
import { type Task } from '../../../shared/interfaces/task.interface';
import { type CdkDragDrop } from '@angular/cdk/drag-drop';
import type { TaskInput } from '../../../shared/interfaces/task-input.interface';

@Component({
  selector: 'el-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  standalone: false
})
export class BoardComponent implements OnInit {
  boardId: string;
  data$: Observable<{
    board: Board;
    columns: Column[];
  }>;

  constructor(
    private boardsService: BoardsService,
    private router: Router,
    private route: ActivatedRoute,
    private boardService: BoardService,
    private socketService: SocketService,
    private columnsService: ColumnsService,
    private tasksService: TasksService,
    private cdr: ChangeDetectorRef
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');

    if (!boardId) {
      throw new Error('Cant get boardID from url');
    }

    this.boardId = boardId;

    this.data$ = combineLatest([
      this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$
    ]).pipe(
      map(([board, columns]) => ({ board, columns })),
      tap(() => this.cdr.detectChanges())
    );
  }

  ngOnInit(): void {
    this.socketService.emit(SocketEvents.BOARDS_JOIN, {
      boardId: this.boardId
    });

    this.fetchData();
    this.initializeListeners();
  }

  trackById(_: number, item: Column | Task) {
    return item.id;
  }

  initializeListeners(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.boardService.leaveBoard(this.boardId);
      }
    });

    this.socketService
      .listen<Column>(SocketEvents.COLUMNS_CREATE_SUCCESS)
      .subscribe((column: Column) => this.boardService.addColumn(column));

    this.socketService
      .listen<Task>(SocketEvents.TASK_CREATE_SUCCESS)
      .subscribe((task: Task) => this.boardService.addTask(task));

    this.socketService
      .listen<{ tasks: Task[]; columnId: string }>(
        SocketEvents.TASKS_UPDATE_SUCCESS
      )
      .pipe(
        tap((updatedInput) =>
          this.boardService.setTasks(updatedInput.tasks, updatedInput.columnId)
        )
      )
      .subscribe();

    this.socketService
      .listen<Column[]>(SocketEvents.COLUMNS_UPDATE_SUCCESS)
      .pipe(
        tap((columns: Column[]) => this.boardService.setColumns(columns)),
        switchMap((columns) => from(columns)),
        concatMap((column: Column) =>
          this.tasksService
            .getTasks(column.id)
            .pipe(
              tap((tasks: Task[]) =>
                this.boardService.setTasks(tasks, column.id)
              )
            )
        )
      )
      .subscribe();
  }

  fetchData(): void {
    forkJoin([
      this.boardsService.getBoard(this.boardId),
      this.columnsService.getColumns(this.boardId)
    ])
      .pipe(
        take(1),
        tap(([board]) => this.boardService.setBoard(board)),
        tap(([_, columns]) =>
          columns.sort((col1, col2) => col1.orderNumber - col2.orderNumber)
        ),
        tap(([_, columns]) => this.boardService.setColumns(columns)),
        switchMap(([_, columns]) => from(columns)),
        concatMap((column: Column) =>
          this.tasksService.getTasks(column.id).pipe(
            tap((tasks) =>
              tasks.sort((t1, t2) => t1.orderNumber - t2.orderNumber)
            ),
            tap((tasks: Task[]) => this.boardService.setTasks(tasks, column.id))
          )
        )
      )
      .subscribe();
  }

  createColumn(title: string): void {
    const columnInput: ColumnInput = {
      title,
      boardId: this.boardId
    };

    this.columnsService.createColumn(columnInput);
  }

  createTask(title: string, columnId: string): void {
    const taskInput: TaskInput = {
      title,
      boardId: this.boardId,
      columnId
    };

    this.tasksService.createTask(taskInput);
  }

  changeColumnPosition(event: CdkDragDrop<Column[]>): void {
    const { previousIndex, currentIndex, item } = event;
    const { data } = item;

    if (previousIndex !== currentIndex) {
      const updatedColumn = { ...data, orderNumber: currentIndex } as Column;

      this.boardService.updateColumnOrder(
        updatedColumn,
        previousIndex,
        currentIndex
      );

      const columns = [...this.boardService.columns$.getValue()];
      const mappedColumns = this.updateColumnsOrder(columns);

      this.columnsService.updateColumnsOrder(mappedColumns);
    }
  }

  changeTaskPosition(event: CdkDragDrop<Task[]>, column: Column): void {
    const { previousIndex, currentIndex, item } = event;
    const { data } = item;

    const updatedTask = { ...data, orderNumber: currentIndex } as Task;
    const isVerticalDrop = data.columnId === column.id;

    this.boardService.updateTaskPosition(
      updatedTask,
      column,
      previousIndex,
      currentIndex,
      isVerticalDrop
    );

    const updatedTasks = this.updateTasksOrder(column);

    this.tasksService.updateTasksOrder(updatedTasks, this.boardId, column.id);

    const previousColumn = [...this.boardService.columns$.getValue()].find(
      (col) => col.id === updatedTask.columnId
    );

    if (previousColumn) {
      this.tasksService.updateTasksOrder(
        previousColumn.tasks ?? [],
        this.boardId,
        previousColumn.id
      );
    }
  }

  private updateTasksOrder(column: Column): Task[] {
    const columns = [...this.boardService.columns$.getValue()];
    const updatedColumn = columns.find((col) => col.id === column.id) as Column;
    const updatedTasks = [...(updatedColumn.tasks ?? [])];

    return updatedTasks.map((task) => ({
      ...task,
      columnId: column.id,
      orderNumber: updatedTasks.findIndex((t) => t.id === task.id)
    }));
  }

  private updateColumnsOrder(columns: Column[]): Column[] {
    return columns.map((col) => ({
      ...col,
      orderNumber: this.boardService.columns$
        .getValue()
        .findIndex((c) => c.id === col.id)
    }));
  }
}
