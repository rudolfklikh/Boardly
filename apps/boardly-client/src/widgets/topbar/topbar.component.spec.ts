import { ComponentFixture } from '@angular/core/testing';

import { provideMockSignalStore } from '@boardly/mock-signal-store';
import { Spectator, createComponentFactory } from '@ngneat/spectator/vitest';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { mockCurrentUser } from '../../shared/mocks';
import { AuthService } from '../../shared/services/auth';
import { SocketService } from '../../shared/services/socket/api/socket.service';
import { CoreStore } from '../../shared/store/core.store';
import { TopbarComponent } from './topbar.component';

describe('topbarComponent', () => {
  let spectator: Spectator<TopbarComponent>;
  let fixture: ComponentFixture<TopbarComponent>;

  const createComponent = createComponentFactory({
    component: TopbarComponent,
    providers: [
      provideMockSignalStore(CoreStore),
      MockProvider(AuthService, {
        getCurrentUser: vi.fn(() => of(mockCurrentUser))
      }),
      MockProvider(SocketService)
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
