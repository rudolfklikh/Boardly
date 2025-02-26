import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
  type WritableSignal
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CoreStore } from '../core/core.store';
import { EAuthSubmitAction } from './auth.model';
import type { LoginRequest } from './interfaces/login-request.interface';
import { type RegisterRequest } from './interfaces/register-request.interface';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  imports: [ReactiveFormsModule],
  standalone: true
})
export class AuthComponent {
  readonly #fb = inject(FormBuilder);
  readonly #coreStore = inject(CoreStore);

  readonly authContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('auth');
  readonly authSubmitActions = EAuthSubmitAction;
  readonly errorMessageS: WritableSignal<string | null> = signal(null);

  readonly signInFormS = signal(
    this.#fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  );

  readonly signUpFormS = signal(
    this.#fb.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  );

  readonly authFormControlsS = computed(() => {
    const { email: sigInEmail, password: signInPassword } =
      this.signInFormS().controls;
    const {
      email: signUpEmail,
      password: signUpPassword,
      username: signUpUsername
    } = this.signUpFormS().controls;
    return {
      sigInEmail,
      signInPassword,
      signUpEmail,
      signUpPassword,
      signUpUsername
    };
  });

  togglePanel(): void {
    this.authContainer().nativeElement.classList.toggle('right-panel-active');
    this.clearForms();
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
    const { value, valid } = this.signInFormS();
    if (!valid) {
      return;
    }

    const setError = (err: HttpErrorResponse) => {
      this.errorMessageS.set(err.error['emailOrPassword'] ?? null);
    };

    this.#coreStore.loginIn({
      payload: value as LoginRequest,
      errorCallback: setError
    });
  }

  private registerUser(): void {
    const { valid, value } = this.signUpFormS();
    if (!valid) {
      return;
    }

    const setError = (err: HttpErrorResponse) => {
      this.errorMessageS.set((err.error as string[]).join(', '));
    };

    this.#coreStore.registerUser({
      payload: value as RegisterRequest,
      errorCallback: setError
    });
  }

  private clearForms(): void {
    this.signUpFormS().markAsUntouched();
    this.signUpFormS().reset();

    this.signInFormS().markAsUntouched();
    this.signInFormS().reset();

    this.errorMessageS.set(null);
  }
}
