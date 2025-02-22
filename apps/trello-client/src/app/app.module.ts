import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { AuthInterceptor } from './auth/services/auth.interceptor.service';
import { SocketService } from './shared/services/socket.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { TopbarComponent } from './shared/components/topbar/topbar.component';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, TopbarComponent, SidebarComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideLottieOptions({
      player: () => player
    }),
    SocketService,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync()
  ]
})
export class AppModule {}
