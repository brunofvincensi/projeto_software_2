import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: '../../components/header/header.component.html',
  styleUrls: ['../header/header.component.css']
})
export class HeaderComponent {
  isLoggedIn = false; // Substituir por serviço de autenticação depois
  userMenu = false;

  toggleUserMenu() {
    this.userMenu = !this.userMenu;
  }

  logout() {
    this.isLoggedIn = false;
    // Implementar logout real depois
  }
}
