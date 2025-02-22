import { Component, type OnInit, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { type CurrentUser } from './auth/interfaces/current-user.interface';
import { SocketService } from './shared/services/socket.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly socketService = inject(SocketService);

  ngOnInit(): void {
    this.authService
      .getCurrentUser()
      .pipe(take(1))
      .subscribe({
        next: (currentUser: CurrentUser) => {
          this.authService.setCurrentUser(currentUser);
          this.socketService.setupSocketConnection(currentUser);
        },
        error: () => this.authService.setCurrentUser(null)
      });
  }
}
