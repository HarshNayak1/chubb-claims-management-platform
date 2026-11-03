import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout-wrapper">
      <!-- Top Navigation Header -->
      <header class="app-header">
        <div class="header-left">
          <div class="brand-container">
            <div class="chubb-mark">CHUBB</div>
            <div class="brand-subtext">Claims Management System | APAC</div>
          </div>
        </div>

        <div class="header-right">
          <div class="user-profile">
            <div class="user-avatar">{{ userInitials() }}</div>
            <div class="user-info">
              <span class="user-name">{{ authService.currentUserName() }}</span>
              <span class="user-role-badge" [ngClass]="'role-' + authService.currentRole()?.toLowerCase()">
                {{ authService.currentRole() }}
              </span>
            </div>
          </div>
          <button (click)="logout()" class="btn-logout" title="Sign out of system">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <!-- Main Body: Sidebar + Content -->
      <div class="app-body">
        <aside class="app-sidebar">
          <div class="nav-section-title">MAIN NAVIGATION</div>
          <nav class="sidebar-nav">
            <!-- USER LINKS -->
            <ng-container *ngIf="authService.currentRole() === 'USER'">
              <a routerLink="/user/dashboard" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">📊</span>
                <span class="nav-label">Dashboard</span>
              </a>
              <a routerLink="/user/create-claim" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">➕</span>
                <span class="nav-label">File New Claim</span>
              </a>
              <a routerLink="/user/my-claims" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">📑</span>
                <span class="nav-label">My Claims</span>
              </a>
            </ng-container>

            <!-- EMPLOYEE LINKS -->
            <ng-container *ngIf="authService.currentRole() === 'EMPLOYEE'">
              <a routerLink="/employee/dashboard" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">📊</span>
                <span class="nav-label">Employee Dashboard</span>
              </a>
              <a routerLink="/employee/claims" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">📋</span>
                <span class="nav-label">Claims Queue & Review</span>
              </a>
            </ng-container>

            <!-- MANAGER LINKS -->
            <ng-container *ngIf="authService.currentRole() === 'MANAGER'">
              <a routerLink="/manager/dashboard" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">📈</span>
                <span class="nav-label">Manager Dashboard</span>
              </a>
              <a routerLink="/manager/claims" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">🗂️</span>
                <span class="nav-label">All Claims</span>
              </a>
              <a routerLink="/manager/users" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">👥</span>
                <span class="nav-label">Registered Claimants</span>
              </a>
              <a routerLink="/manager/employees" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">👔</span>
                <span class="nav-label">Claims Staff</span>
              </a>
            </ng-container>
          </nav>

          <div class="sidebar-footer">
            <div class="system-tag">CHUBB ENTERPRISE v1.0</div>
            <div class="system-status"><span class="status-indicator"></span> H2 In-Memory Active</div>
          </div>
        </aside>

        <!-- Main Content View -->
        <main class="app-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: var(--chubb-bg);
    }

    .app-header {
      height: 64px;
      background-color: var(--chubb-navy);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .brand-container {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }

    .chubb-mark {
      font-size: 1.45rem;
      font-weight: 900;
      letter-spacing: 2.5px;
      color: #ffffff;
      border-left: 4px solid var(--chubb-red);
      padding-left: 8px;
    }

    .brand-subtext {
      font-size: 0.85rem;
      color: #94a3b8;
      font-weight: 500;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--chubb-navy-light);
      border: 2px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 700;
      color: #ffffff;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 0.88rem;
      font-weight: 600;
      color: #ffffff;
    }

    .user-role-badge {
      font-size: 0.68rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-block;
      width: fit-content;
    }

    .role-user { background: #0369a1; color: white; }
    .role-employee { background: #b45309; color: white; }
    .role-manager { background: var(--chubb-red); color: white; }

    .btn-logout {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 6px 14px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      transition: background 0.2s;
    }

    .btn-logout:hover {
      background: var(--chubb-red);
      border-color: var(--chubb-red);
    }

    .app-body {
      display: flex;
      flex: 1;
    }

    .app-sidebar {
      width: 250px;
      background: white;
      border-right: 1px solid var(--chubb-border);
      display: flex;
      flex-direction: column;
      padding: 20px 0;
    }

    .nav-section-title {
      font-size: 0.7rem;
      font-weight: 800;
      color: var(--chubb-text-muted);
      letter-spacing: 1px;
      padding: 0 20px 10px 20px;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 0 10px;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      color: var(--chubb-text);
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.15s ease;
    }

    .nav-item:hover {
      background-color: var(--chubb-bg);
      color: var(--chubb-navy);
    }

    .nav-item.active {
      background-color: #e0f2fe;
      color: var(--chubb-navy);
      border-left: 4px solid var(--chubb-navy);
      font-weight: 700;
    }

    .sidebar-footer {
      padding: 16px 20px;
      border-top: 1px solid var(--chubb-border);
      font-size: 0.75rem;
      color: var(--chubb-text-muted);
    }

    .system-tag {
      font-weight: 700;
      color: var(--chubb-navy);
      margin-bottom: 4px;
    }

    .system-status {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #16a34a;
    }

    .app-content {
      flex: 1;
      padding: 28px;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    @media (max-width: 768px) {
      .app-body {
        flex-direction: column;
      }
      .app-sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--chubb-border);
        padding: 10px 0;
      }
      .brand-subtext {
        display: none;
      }
    }
  `]
})
export class LayoutComponent {
  userInitials = computed(() => {
    const name = this.authService.currentUserName();
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  });

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
