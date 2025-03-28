import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineFormComponent } from './inline-form.component';

describe('InlineFormComponent', () => {
  let component: InlineFormComponent;
  let fixture: ComponentFixture<InlineFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InlineFormComponent]
    });
    fixture = TestBed.createComponent(InlineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
