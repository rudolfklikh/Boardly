import type { HttpErrorResponse } from '@angular/common/http';

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface RegisterPayload {
  payload: RegisterRequest;
  errorCallback: (error: HttpErrorResponse) => void;
}
