import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../widgets/sidebar/sidebar.component';
import { TopbarComponent } from '../widgets/topbar/topbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [TopbarComponent, SidebarComponent, RouterOutlet]
})
export class AppComponent {}
