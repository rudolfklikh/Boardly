import { ComponentFixture } from '@angular/core/testing';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  convertToParamMap,
  provideRouter
} from '@angular/router';
import { Spectator, createComponentFactory } from '@ngneat/spectator/vitest';
import { MockComponent, MockProvider } from 'ng-mocks';
import { BehaviorSubject, of } from 'rxjs';
import { BoardsService } from '../../entities/board/api/boards.service';
import { ColumnsService } from '../../entities/board/api/columns.service';
import { TasksService } from '../../entities/board/api/tasks.service';
import type { Board } from '../../entities/board/model/board.interface';
import type { Column } from '../../entities/board/model/column.interface';
import { BoardService } from '../../entities/board/services/board.service';
import { SocketService } from '../../shared/services/socket/api/socket.service';
import { TopbarComponent } from '../../widgets/topbar/topbar.component';
import { BoardComponent } from './board.component';

describe('boardComponent', () => {
  let spectator: Spectator<BoardComponent>;
  let fixture: ComponentFixture<BoardComponent>;

  const createComponent = createComponentFactory({
    component: BoardComponent,
    imports: [MockComponent(TopbarComponent)],
    providers: [
      provideRouter([]),
      MockProvider(ActivatedRoute, {
        snapshot: {
          paramMap: convertToParamMap({ boardId: '1' })
        } as ActivatedRouteSnapshot
      }),
      MockProvider(BoardsService, {
        getBoard: vi.fn(() => of())
      }),
      MockProvider(BoardService, {
        board$: vi.fn(() => new BehaviorSubject<null | Board>(null))(),
        columns$: vi.fn(() => new BehaviorSubject<Column[]>([]))()
      }),
      MockProvider(SocketService, {
        listen: <T>() => of([] as T)
      }),
      MockProvider(ColumnsService, {
        getColumns: vi.fn(() => of())
      }),
      MockProvider(TasksService)
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    fixture = spectator.fixture;
  });

  it('should create', () => {
    expect.assertions(1);

    expect(spectator.component).toBeTruthy();
  });
});
