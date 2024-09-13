import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { Router } from '@angular/router';
import { INavbarData, fadeInOut } from './helper';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../services/auth/auth.service';
import { AppStorage } from '../storage/app.storage';
import { jwtDecode } from "jwt-decode";

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' })
          ])
        )
      ])
    ])
  ]
})

export class SidenavComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = false;
  userRole?: string;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  constructor(
    public router: Router,
    private appStorage: AppStorage,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.userRole = this.appStorage.getToken();
  }

  setUserRole(token: string) {
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userRole = decoded.role;
    }
  }

  hasPermission(item: INavbarData) {
    if (item.except) {
      return !!item.except.find(m => m !== this.userRole);
    }
    if (item.accept) {
      return !!item.accept.find(m => m === this.userRole);
    }
    return true;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  handleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }

  logout(): void {
    this.authService.logout(); // Cierra la sesión
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }

}