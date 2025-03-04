import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CoreStore } from '../../../core/core.store';

@Component({
  selector: 'el-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  readonly #coreStore = inject(CoreStore);
  readonly #router = inject(Router);
  readonly currentUserS = this.#coreStore.currentUser;

  logout(): void {
    this.#coreStore.logout();
    this.#router.navigate(['/auth']);
  }
}
