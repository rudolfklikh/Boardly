import { ComponentFixture } from '@angular/core/testing';

import { provideMockSignalStore } from '@boardly/mock-signal-store';
import {
  createComponentFactory,
  type Spectator
} from '@ngneat/spectator/vitest';
import { MockComponent, MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { BoardsService } from '../../entities/board/api/boards.service';
import { BoardsStore } from '../../entities/board/store/boards.store';
import { BoardsEmptyComponent } from '../../entities/board/ui/boards-empty/boards-empty.component';
import { BoardsComponent } from './boards.component';

describe('boardsComponent', () => {
  let spectator: Spectator<BoardsComponent>;
  let fixture: ComponentFixture<BoardsComponent>;

  const createComponent = createComponentFactory({
    component: BoardsComponent,
    imports: [MockComponent(BoardsEmptyComponent)],
    providers: [
      provideMockSignalStore(BoardsStore),
      MockProvider(BoardsService, {
        getBoards: vi.fn(() => of([]))
      })
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
