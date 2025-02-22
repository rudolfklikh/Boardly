import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardsEmptyComponent } from './boards-empty.component';

describe('BoardsEmptyComponent', () => {
  let component: BoardsEmptyComponent;
  let fixture: ComponentFixture<BoardsEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardsEmptyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardsEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
