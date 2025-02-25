import { Component } from '@angular/core';
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
export class AppComponent {}
