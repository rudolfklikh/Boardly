import { ComponentFixture } from '@angular/core/testing';

import {
  createComponentFactory,
  type Spectator
} from '@ngneat/spectator/vitest';
import { InlineFormComponent } from './inline-form.component';

describe('inlineFormComponent', () => {
  let spectator: Spectator<InlineFormComponent>;
  let fixture: ComponentFixture<InlineFormComponent>;

  const createComponent = createComponentFactory({
    component: InlineFormComponent
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
