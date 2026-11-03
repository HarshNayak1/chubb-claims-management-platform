import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClaimService } from '../../../services/claim.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-manager-employees',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="manager-employees-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Claims Assessment Personnel</h1>
          <p class="page-subtitle">Directory of claims assessors authorized to adjudicate policy claims</p>
        </div>
        <a routerLink="/manager/dashboard" class="btn btn-secondary">
          &larr; Back to Dashboard
        </a>
      </div>

      <!-- Compliance Notice Card -->
      <div class="alert alert-info">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <div>
          <strong>Read-Only Access (Version 1 MVP):</strong>
          <span> Internal staff roster is displayed for managerial audit and case allocation tracking. Staff credentials and security keys remain strictly encrypted.</span>
        </div>
      </div>

      <!-- Employees Table Card -->
      <div class="card">
        <div class="card-title">
          <span>Active Claims Staff Roster ({{ employees().length }})</span>
        </div>

        <div *ngIf="isLoading()" class="state-msg">
          Loading claims staff directory...
        </div>

        <div *ngIf="!isLoading() && employees().length === 0" class="state-msg">
          No employee records found in database.
        </div>

        <div *ngIf="!isLoading() && employees().length > 0" class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Employee Full Name</th>
                <th>Corporate Email</th>
                <th>Assigned Role</th>
                <th>Employment Status</th>
                <th>Onboarding Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let emp of employees()">
                <td>
                  <strong class="emp-id">#{{ emp.id }}</strong>
                </td>
                <td>
                  <strong class="emp-name">{{ emp.fullName }}</strong>
                </td>
                <td>{{ emp.email }}</td>
                <td>
                  <span class="badge badge-UNDER_REVIEW">{{ emp.role }}</span>
                </td>
                <td>
                  <span *ngIf="emp.active" class="status-pill active">● Active Assessor</span>
                  <span *ngIf="!emp.active" class="status-pill inactive">● Inactive</span>
                </td>
                <td>{{ emp.createdAt | date:'mediumDate' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .emp-id {
      color: var(--chubb-navy);
      font-family: monospace;
    }

    .emp-name {
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
export class ManagerEmployeesComponent implements OnInit {
  employees = signal<User[]>([]);
  isLoading = signal<boolean>(true);

  constructor(
    private claimService: ClaimService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.isLoading.set(true);
    this.cdr.markForCheck();
    this.claimService.getStaffEmployees().subscribe({
      next: (data) => {
        this.employees.set(data);
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
