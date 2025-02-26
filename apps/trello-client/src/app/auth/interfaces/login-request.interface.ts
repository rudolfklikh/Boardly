import type { HttpErrorResponse } from '@angular/common/http';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginPayload {
  payload: LoginRequest;
  errorCallback: (error: HttpErrorResponse) => void;
}
