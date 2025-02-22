import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';

@NgModule({
  declarations: [AuthComponent],
  imports: [CommonModule, ReactiveFormsModule, AuthRoutingModule, RouterModule],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AuthModule {}
