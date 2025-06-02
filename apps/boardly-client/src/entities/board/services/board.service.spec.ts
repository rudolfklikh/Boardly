import type { SpectatorService } from '@ngneat/spectator';
import { createServiceFactory } from '@ngneat/spectator/vitest';
import { MockProvider } from 'ng-mocks';
import { SocketService } from '../../../shared/services/socket/api/socket.service';
import { BoardService } from './board.service';

describe('boardService', () => {
  let spectator: SpectatorService<BoardService>;
  let service: BoardService;

  const createService = createServiceFactory({
    service: BoardService,
    providers: [MockProvider(SocketService)]
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect.assertions(1);
    expect(service).toBeTruthy();
  });
});
