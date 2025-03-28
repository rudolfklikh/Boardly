import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import {
  provideExperimentalZonelessChangeDetection,
  type ApplicationConfig
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { AuthInterceptor, AuthService } from '@boardly/shared/services/auth';
import { SocketService } from '@boardly/shared/services/socket/api/socket.service';
import { CoreStore } from '@boardly/shared/store/core.store';
import player from 'lottie-web';
import { provideLottieOptions } from 'ngx-lottie';
import { appRoutes } from './app.routes';

export const appConfig: Readonly<ApplicationConfig> = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
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
