import { ComponentFixture } from '@angular/core/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator/vitest';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let spectator: Spectator<BoardComponent>;
  let fixture: ComponentFixture<BoardComponent>;

  const createComponent = createComponentFactory({
    component: BoardComponent
  });

  beforeEach(() => {
    spectator = createComponent();
    fixture = spectator.fixture;
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
