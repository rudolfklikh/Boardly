import { provideRouter } from '@angular/router';
import { provideMockSignalStore } from '@boardly/mock-signal-store';
import { Spectator, createComponentFactory } from '@ngneat/spectator/vitest';
import { MockProvider } from 'ng-mocks';
import { AuthService } from '../../shared/services/auth/api/auth.service';
import { SocketService } from '../../shared/services/socket/api/socket.service';
import { CoreStore } from '../../shared/store/core.store';
import { SidebarComponent } from './sidebar.component';

describe('sidebarComponent', () => {
  let spectator: Spectator<SidebarComponent>;
  let store: CoreStore;

  const createComponent = createComponentFactory({
    component: SidebarComponent,
    providers: [
      MockProvider(AuthService, {
        login: vi.fn(),
        getCurrentUser: vi.fn()
      }),
      MockProvider(SocketService),
      provideRouter([]),
      provideMockSignalStore(CoreStore)
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    store = spectator.inject(CoreStore);
  });

  it('should create', () => {
    expect.assertions(1);
    expect(spectator.component).toBeTruthy();
  });
});
