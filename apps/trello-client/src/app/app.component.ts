import { Component, inject, type OnInit } from '@angular/core';
import { TopbarComponent } from './shared/components/topbar/topbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { CoreStore } from './shared/store/core.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  providers: [CoreStore],
  imports: [TopbarComponent, SidebarComponent, RouterOutlet]
})
export class AppComponent implements OnInit {
  readonly #coreStore = inject(CoreStore);

  ngOnInit() {
    this.#coreStore.loadCurrentUser();
  }
}
