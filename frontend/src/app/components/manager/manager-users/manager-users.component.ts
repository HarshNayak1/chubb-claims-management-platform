import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClaimService } from '../../../services/claim.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-manager-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="manager-users-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Registered Policyholder Claimants</h1>
          <p class="page-subtitle">Directory of customer accounts authorized to file insurance claims</p>
        </div>
        <a routerLink="/manager/dashboard" class="btn btn-secondary">
          &larr; Back to Dashboard
        </a>
      </div>

      <!-- Security Notice Card -->
      <div class="alert alert-info">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <div>
          <strong>Read-Only Access (Version 1 MVP):</strong>
          <span> Policyholder security is strictly enforced. User credentials are encrypted using BCrypt and are never exposed or editable by managers or employees.</span>
        </div>
      </div>

      <!-- Users Table Card -->
      <div class="card">
        <div class="card-title">
          <span>Active Policyholder Accounts ({{ users().length }})</span>
        </div>

        <div *ngIf="isLoading()" class="state-msg">
          Loading claimants directory...
        </div>

        <div *ngIf="!isLoading() && users().length === 0" class="state-msg">
          No registered policyholders found in database.
        </div>

        <div *ngIf="!isLoading() && users().length > 0" class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Registered Email</th>
                <th>Role</th>
                <th>Account Status</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users()">
                <td>
                  <strong class="user-id">#{{ user.id }}</strong>
                </td>
                <td>
                  <strong class="user-name">{{ user.fullName }}</strong>
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge badge-SUBMITTED">{{ user.role }}</span>
                </td>
                <td>
                  <span *ngIf="user.active" class="status-pill active">● Active</span>
                  <span *ngIf="!user.active" class="status-pill inactive">● Inactive</span>
                </td>
                <td>{{ user.createdAt | date:'mediumDate' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-id {
      color: var(--chubb-navy);
      font-family: monospace;
    }

    .user-name {
      color: var(--chubb-navy);
    }

    .status-pill {
      font-size: 0.82rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .status-pill.active {
      background: #dcfce7;
      color: #15803d;
    }

    .status-pill.inactive {
      background: #fee2e2;
      color: #b91c1c;
    }

    .state-msg {
      padding: 40px;
      text-align: center;
      color: var(--chubb-text-muted);
    }
  `]
})
export class ManagerUsersComponent implements OnInit {
  users = signal<User[]>([]);
  isLoading = signal<boolean>(true);

  constructor(
    private claimService: ClaimService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading.set(true);
    this.cdr.markForCheck();
    this.claimService.getRegisteredUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      }
    });
  }
}
