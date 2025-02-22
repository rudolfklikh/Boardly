import { Component, type OnInit, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { type CurrentUser } from './auth/interfaces/current-user.interface';
import { SocketService } from './shared/services/socket.service';
import { take } from 'rxjs';
import { TopbarComponent } from './shared/components/topbar/topbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [TopbarComponent, SidebarComponent, RouterOutlet]
})
export class AppComponent implements OnInit {
  readonly #authService = inject(AuthService);
  readonly #socketService = inject(SocketService);

  ngOnInit(): void {
    this.#authService
      .getCurrentUser()
      .pipe(take(1))
      .subscribe({
        next: (currentUser: Readonly<CurrentUser>) => {
          this.#authService.setCurrentUser(currentUser);
          this.#socketService.setupSocketConnection(currentUser);
        },
        error: () => this.#authService.setCurrentUser(null)
      });
  }
}
