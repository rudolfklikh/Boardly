import { DragDropModule, type CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  type OnInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { concatMap, filter, forkJoin, from, switchMap, take, tap } from 'rxjs';
import { BoardsService } from '../../entities/board/api/boards.service';
import { ColumnsService } from '../../entities/board/api/columns.service';
import { TasksService } from '../../entities/board/api/tasks.service';
import { type Column } from '../../entities/board/model/column.interface';
import { type Task } from '../../entities/board/model/task.interface';
import { BoardService } from '../../entities/board/services/board.service';
import { SocketService } from '../../shared/services/socket/api/socket.service';
import { SocketEvents } from '../../shared/services/socket/model/socket-events.enum';
import { TopbarComponent } from '../../widgets/topbar/topbar.component';
import { InlineFormComponent } from '../../features/ui/inline-form/inline-form.component';

@Component({
  selector: 'el-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  standalone: true,
  providers: [BoardService, ColumnsService, TasksService, BoardsService],
  imports: [DragDropModule, TopbarComponent, InlineFormComponent]
})
export class BoardComponent implements OnInit {
  readonly #boardsService = inject(BoardsService);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #boardService = inject(BoardService);
  readonly #socketService = inject(SocketService);
  readonly #columnsService = inject(ColumnsService);
  readonly #tasksService = inject(TasksService);
  readonly #destroyRef = inject(DestroyRef);

  readonly boardId = this.#route.snapshot.paramMap.get('boardId') ?? '';

  readonly board = this.#boardService.board;
  readonly columns = this.#boardService.columns;

  readonly data = computed(() => {
    const board = this.board();
    const columns = this.columns();
    return board ? { board, columns } : null;
  });

  constructor() {
    if (!this.boardId) {
      throw new Error('Cant get boardID from url');
    }
  }

  ngOnInit(): void {
    this.#socketService.emit(SocketEvents.BOARDS_JOIN, {
      boardId: this.boardId
    });

    this.fetchData();
    this.initializeListeners();
  }

  trackById(_: number, item: Column | Task) {
    return item.id;
  }

  initializeListeners(): void {
    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(() => this.#boardService.leaveBoard(this.boardId));

    this.#socketService
      .listen<Column>(SocketEvents.COLUMNS_CREATE_SUCCESS)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((column: Column) => this.#boardService.addColumn(column));

    this.#socketService
      .listen<Task>(SocketEvents.TASK_CREATE_SUCCESS)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((task: Task) => this.#boardService.addTask(task));

    this.#socketService
      .listen<{ tasks: Task[]; columnId: string }>(
        SocketEvents.TASKS_UPDATE_SUCCESS
      )
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((updatedInput) =>
        this.#boardService.setTasks(updatedInput.tasks, updatedInput.columnId)
      );

    this.#socketService
      .listen<Column[]>(SocketEvents.COLUMNS_UPDATE_SUCCESS)
      .pipe(
        tap((columns: Column[]) => this.#boardService.setColumns(columns)),
        switchMap((columns) => from(columns)),
        concatMap((column: Column) =>
          this.#tasksService
            .getTasks(column.id)
            .pipe(
              tap((tasks: Task[]) =>
                this.#boardService.setTasks(tasks, column.id)
              )
            )
        ),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  fetchData(): void {
    forkJoin([
      this.#boardsService.getBoard(this.boardId),
      this.#columnsService.getColumns(this.boardId)
    ])
      .pipe(
        take(1),
        tap(([board, columns]) => {
          const cols = [...columns].sort(
            (col1, col2) => col1.orderNumber - col2.orderNumber
          );
          this.#boardService.setBoard(board);
          this.#boardService.setColumns(cols);
        }),
        switchMap(([_, columns]) => from(columns)),
        concatMap((column: Column) =>
          this.#tasksService.getTasks(column.id).pipe(
            tap((tasks) =>
              [...tasks].sort((t1, t2) => t1.orderNumber - t2.orderNumber)
            ),
            tap((tasks: Task[]) =>
              this.#boardService.setTasks(tasks, column.id)
            )
          )
        ),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  createColumn(title: string): void {
    this.#columnsService.createColumn({
      title,
      boardId: this.boardId
    });
  }

  createTask(title: string, columnId: string): void {
    this.#tasksService.createTask({
      title,
      boardId: this.boardId,
      columnId
    });
  }

  changeColumnPosition(event: CdkDragDrop<Column[]>): void {
    const { previousIndex, currentIndex, item } = event;
    const { data } = item;

    if (previousIndex !== currentIndex) {
      const updatedColumn = { ...data, orderNumber: currentIndex } as Column;

      this.#boardService.updateColumnOrder(
        updatedColumn,
        previousIndex,
        currentIndex
      );

      const columns = [...this.#boardService.columns()];
      const mappedColumns = this.updateColumnsOrder(columns);

      this.#columnsService.updateColumnsOrder(mappedColumns);
    }
  }

  changeTaskPosition(event: CdkDragDrop<Task[]>, column: Column): void {
    const { previousIndex, currentIndex, item } = event;
    const { data } = item;

    const updatedTask = { ...data, orderNumber: currentIndex } as Task;
    const isVerticalDrop = data.columnId === column.id;

    this.#boardService.updateTaskPosition(
      updatedTask,
      column,
      previousIndex,
      currentIndex,
      isVerticalDrop
    );

    const updatedTasks = this.updateTasksOrder(column);

    this.#tasksService.updateTasksOrder(updatedTasks, this.boardId, column.id);

    const previousColumn = [...this.#boardService.columns()].find(
      (col) => col.id === updatedTask.columnId
    );

    if (previousColumn) {
      this.#tasksService.updateTasksOrder(
        previousColumn.tasks ?? [],
        this.boardId,
        previousColumn.id
      );
    }
  }

  private updateTasksOrder(column: Column): Task[] {
    const columns = [...this.#boardService.columns()];
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
      orderNumber: this.#boardService
        .columns()
        .findIndex((c) => c.id === col.id)
    }));
  }
}
