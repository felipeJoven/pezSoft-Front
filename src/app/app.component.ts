import { Component } from '@angular/core';
import { AuthService } from './components/services/auth/auth.service';
import { Router } from '@angular/router';
import { Usuario } from './components/models/usuario';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'PezSoft';

  usuarios!: Usuario;

  isSideNavCollapsed = false;
  screenWidth = 0;

  constructor(
    public router: Router,
    public authService: AuthService
    ) {}

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
