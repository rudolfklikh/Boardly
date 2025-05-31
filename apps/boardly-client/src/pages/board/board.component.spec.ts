import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';

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
