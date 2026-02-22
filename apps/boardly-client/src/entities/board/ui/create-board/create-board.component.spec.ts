import { ComponentFixture } from '@angular/core/testing';

import { MatDialogRef } from '@angular/material/dialog';
import type { Spectator } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/vitest';
import { MockProvider } from 'ng-mocks';
import { CreateBoardComponent } from './create-board.component';

describe('createBoardComponent', () => {
  let spectator: Spectator<CreateBoardComponent>;
  let fixture: ComponentFixture<CreateBoardComponent>;

  const createComponent = createComponentFactory({
    component: CreateBoardComponent,
    providers: [MockProvider(MatDialogRef)]
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
