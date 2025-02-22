import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'el-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  readonly #authService = inject(AuthService);

  protected userInitial = toSignal(
    this.#authService.currentUser$.pipe(
      map((currentUser) => currentUser?.username.slice(0, 1).toUpperCase())
    )
  );
}
