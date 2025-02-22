import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'el-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected user = toSignal(this.authService.currentUser$);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
