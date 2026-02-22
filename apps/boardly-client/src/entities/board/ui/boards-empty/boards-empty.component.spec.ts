import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  createComponentFactory,
  type Spectator
} from '@ngneat/spectator/vitest';
import { MockProvider } from 'ng-mocks';
import { AnimationLoader } from 'ngx-lottie';
import { of } from 'rxjs';
import { BoardsEmptyComponent } from './boards-empty.component';

describe('boardsEmptyComponent', () => {
  let spectator: Spectator<BoardsEmptyComponent>;
  let fixture: ComponentFixture<BoardsEmptyComponent>;

  const createComponent = createComponentFactory({
    component: BoardsEmptyComponent,
    providers: [
      MockProvider(AnimationLoader, {
        loadAnimation: vi.fn(() => of())
      })
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    fixture = TestBed.createComponent(BoardsEmptyComponent);
  });

  it('should create', () => {
    expect.assertions(1);
    expect(spectator.component).toBeTruthy();
  });
});
