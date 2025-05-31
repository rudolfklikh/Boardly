import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import {
  provideZoneChangeDetection,
  type ApplicationConfig
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import player from 'lottie-web';
import { provideLottieOptions } from 'ngx-lottie';
import { AuthInterceptor, AuthService } from '../shared/services/auth';
import { SocketService } from '../shared/services/socket/api/socket.service';
import { CoreStore } from '../shared/store/core.store';
import { appRoutes } from './app.routes';

export const appConfig: Readonly<ApplicationConfig> = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    provideLottieOptions({
      player: () => player
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    CoreStore,
    // TODO remove when all modules are refactored
    AuthService,
    SocketService
  ]
};
