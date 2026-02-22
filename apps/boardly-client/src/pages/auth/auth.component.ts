import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
  type WritableSignal
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  EAuthSubmitAction,
  type LoginRequest,
  type RegisterRequest
} from '../../shared/services/auth';
import { CoreStore } from '../../shared/store/core.store';
import { FormField, form, required } from '@angular/forms/signals';
import { FormErrorMessages } from '../../shared/components/form-error-messages/form-error-messages';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  imports: [ReactiveFormsModule, FormField, FormErrorMessages],
  standalone: true
})
export class AuthComponent {
  readonly #coreStore = inject(CoreStore);

  readonly authContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('auth');
  readonly authSubmitActions = EAuthSubmitAction;
  readonly errorMessageS: WritableSignal<string | null> = signal(null);

  readonly signInForm = form(
    signal({
      email: '',
      password: ''
    }),
    (context) => {
      required(context.email);
      required(context.password);
    }
  );

  readonly signUpForm = form(
    signal({
      email: '',
      username: '',
      password: ''
    }),
    (context) => {
      required(context.email);
      required(context.username);
      required(context.password);
    }
  );

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

  private loginUser(): void {
    const { value, valid } = this.signInForm();
    if (!valid) {
      return;
    }

    const setError = (err: HttpErrorResponse) => {
      this.errorMessageS.set(err.error['emailOrPassword'] ?? null);
    };

    this.#coreStore.loginIn({
      payload: value() as LoginRequest,
      errorCallback: setError
    });
  }

  private registerUser(): void {
    const { valid, value } = this.signUpForm();
    if (!valid) {
      return;
    }

    const setError = (err: HttpErrorResponse) => {
      this.errorMessageS.set((err.error as string[]).join(', '));
    };

    this.#coreStore.registerUser({
      payload: value() as RegisterRequest,
      errorCallback: setError
    });
  }

  private clearForms(): void {
    this.signUpForm().reset();
    this.signUpForm().setControlValue({
      email: '',
      password: '',
      username: ''
    });

    this.signInForm().reset();
    this.signInForm().setControlValue({ email: '', password: '' });

    this.errorMessageS.set(null);
  }
}
