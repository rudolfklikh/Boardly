import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { EAuthSubmitAction } from './auth.model';
import { type CurrentUser } from './interfaces/current-user.interface';
import { type LoginRequest } from './interfaces/login-request.interface';
import { type RegisterRequest } from './interfaces/register-request.interface';
import { SocketService } from '../shared/services/socket.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: false
})
export class AuthComponent {
  readonly #fb = inject(FormBuilder);
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly #socketService = inject(SocketService);

  authContainer = viewChild.required<ElementRef<HTMLDivElement>>('auth');
  authSubmitActions = EAuthSubmitAction;
  errorMessage: string | null = null;

  signInForm = this.#fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  signUpForm = this.#fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  get userName(): FormControl {
    return this.signUpForm.controls.username;
  }

  get signUpEmail(): FormControl {
    return this.signUpForm.controls.email;
  }

  get signUpPassword(): FormControl {
    return this.signUpForm.controls.password;
  }

  get signInEmail(): FormControl {
    return this.signInForm.controls.email;
  }

  get signInPassword(): FormControl {
    return this.signInForm.controls.password;
  }

  togglePanel(): void {
    this.authContainer().nativeElement.classList.toggle('right-panel-active');
    this.clearForm();
  }

  onSubmit(submitAction: EAuthSubmitAction): void {
    if (submitAction === EAuthSubmitAction.SIGN_IN) {
      this.loginUser();
    }

    if (submitAction === EAuthSubmitAction.SIGN_UP) {
      this.registerUser();
    }
  }

  showError(formControl: FormControl): boolean {
    return formControl.invalid && (formControl.dirty || formControl.touched);
  }

  private loginUser(): void {
    if (!this.signInForm.valid) {
      return;
    }

    this.#authService.login(this.signInForm.value as LoginRequest).subscribe({
      next: (user: CurrentUser) => {
        this.setupUser(user);
        this.#router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage =
          (err.error as Record<string, string>)['emailOrPassword'] ?? null;
      }
    });
  }

  private registerUser(): void {
    if (!this.signUpForm.valid) {
      return;
    }

    this.#authService
      .register(this.signUpForm.value as RegisterRequest)
      .subscribe({
        next: (user: CurrentUser) => {
          this.setupUser(user);
          this.#router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = (err.error as string[]).join(', ');
        }
      });
  }

  private setupUser(user: CurrentUser): void {
    this.#authService.setToken(user);
    this.#authService.setCurrentUser(user);
    this.#socketService.setupSocketConnection(user);
    this.errorMessage = null;
  }

  private clearForm(): void {
    this.signUpForm.markAsUntouched();
    this.signUpForm.reset();

    this.signInForm.markAsUntouched();
    this.signInForm.reset();

    this.errorMessage = null;
  }
}
