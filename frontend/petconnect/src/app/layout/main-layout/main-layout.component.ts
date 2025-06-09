import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MenuItem } from 'src/app/models/menu-item.model';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  currentRoute = '';
  user: any;
  menuItems: MenuItem[] = [];
  currentYear = 2025
  isSidebarCollapsed = false;
  isMobileSidebarVisible = false;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.initMenuItems();
    this.trackRouteChanges();
    this.onResize();
  }

  @HostListener('window:resize', [])
  onResize() {
    const isDesktop = window.innerWidth > 992;

    if (isDesktop && this.isMobileSidebarVisible) {
      this.isMobileSidebarVisible = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(): void {
    this.user = this.auth.getCurrentUser();
  }

  private initMenuItems(): void {
    this.menuItems = [
      {
        title: 'Animais desaparecidos',
        icon: 'pets',
        path: '/animais-desaparecidos',
        isActive: false
      },
      {
        title: 'Doações',
        icon: 'pets',
        path: '/animais-doacao',
        isActive: false
      },
      {
        title: 'Sobre',
        icon: 'pets',
        path: '/sobre',
        isActive: false
      }
    ];
  }

  private trackRouteChanges(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
      this.updateActiveMenuItems();
    });
  }

  private updateActiveMenuItems(): void {
    this.menuItems.forEach(item => {
      item.isActive = this.currentRoute.includes(item.path);

      if (item.children) {
        item.children.forEach(child => {
          child.isActive = this.currentRoute === child.path;
        });
      }
    });
  }

  toggleSidebar(): void {
    if (window.innerWidth <= 992) {
      this.isMobileSidebarVisible = !this.isMobileSidebarVisible;
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  navigateToMeuPerfil(): void {
    this.navigateTo("usuario/form/" + this.auth.getCurrentUser()?.id)
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
