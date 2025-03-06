import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreStore } from '../../../core/core.store';

@Component({
  selector: 'el-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  readonly #coreStore = inject(CoreStore);
  readonly userInitialS = computed(() =>
    this.#coreStore.currentUser()?.username.slice(0, 1).toUpperCase()
  );
}
