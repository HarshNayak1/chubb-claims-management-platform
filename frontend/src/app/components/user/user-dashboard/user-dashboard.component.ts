import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClaimService } from '../../../services/claim.service';
import { AuthService } from '../../../services/auth.service';
import { Claim, DashboardStats } from '../../../models/claim.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="user-dashboard">
      <div class="page-header">
        <div>
          <h1 class="page-title">Welcome back, {{ authService.currentUserName() }}</h1>
          <p class="page-subtitle">Chubb Policyholder Claims Portal – Track and file insurance claims</p>
        </div>
        <a routerLink="/user/create-claim" class="btn btn-primary">
          <span>➕ File a New Claim</span>
        </a>
      </div>

      <!-- Quick Action Alert Banner -->
      <div class="quick-banner">
        <div class="banner-text">
          <strong>Need to report new motor or property damage?</strong>
          <span>Our APAC claims team is ready to review your submission 24/7.</span>
        </div>
        <a routerLink="/user/create-claim" class="btn btn-danger btn-sm">Report Incident Now</a>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card accent-blue">
          <div class="stat-label">Total Claims Filed</div>
          <div class="stat-value">{{ stats()?.totalClaims || 0 }}</div>
        </div>
        <div class="stat-card accent-amber">
          <div class="stat-label">Pending / In Review</div>
          <div class="stat-value">{{ stats()?.pendingClaims || 0 }}</div>
        </div>
        <div class="stat-card accent-green">
          <div class="stat-label">Approved Claims</div>
          <div class="stat-value">{{ stats()?.approvedClaims || 0 }}</div>
        </div>
        <div class="stat-card accent-teal">
          <div class="stat-label">Settled Claims</div>
          <div class="stat-value">{{ stats()?.settledClaims || 0 }}</div>
        </div>
      </div>

      <!-- Recent Claims Section -->
      <div class="card">
        <div class="card-title">
          <span>Recent Claims</span>
          <a routerLink="/user/my-claims" class="view-all-link">View All My Claims &rarr;</a>
        </div>

        <div *ngIf="isLoading()" class="loading-state">
          Loading your insurance claims...
        </div>

        <div *ngIf="!isLoading() && recentClaims().length === 0" class="empty-state">
          <p>You have not filed any insurance claims yet.</p>
          <a routerLink="/user/create-claim" class="btn btn-primary btn-sm" style="margin-top: 10px;">
            Submit Your First Claim
          </a>
        </div>

        <div *ngIf="!isLoading() && recentClaims().length > 0" class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Claim Number</th>
                <th>Type</th>
                <th>Incident Date</th>
                <th>Location</th>
                <th>Estimated Loss</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let claim of recentClaims()">
                <td>
                  <strong>{{ claim.claimNumber }}</strong>
                </td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + claim.claimType">{{ claim.claimType }}</span>
                </td>
                <td>{{ claim.incidentDate }}</td>
                <td>{{ claim.incidentLocation }}</td>
                <td>\${{ claim.estimatedLoss | number:'1.2-2' }}</td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + claim.status">{{ claim.status }}</span>
                </td>
                <td>
                  <a [routerLink]="['/user/my-claims', claim.id]" class="btn btn-secondary btn-sm">
                    View Details
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quick-banner {
      background: linear-gradient(90deg, #002B49 0%, #00406c 100%);
      color: white;
      padding: 16px 20px;
      border-radius: var(--radius-md);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
      border-left: 5px solid var(--chubb-red);
    }

    .banner-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .banner-text strong {
      font-size: 0.95rem;
    }

    .banner-text span {
      font-size: 0.85rem;
      color: #cbd5e1;
    }

    .view-all-link {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--chubb-navy);
    }

    .loading-state, .empty-state {
      padding: 32px;
      text-align: center;
      color: var(--chubb-text-muted);
    }
  `]
})
export class UserDashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  recentClaims = signal<Claim[]>([]);
  isLoading = signal<boolean>(true);

  constructor(
    public authService: AuthService,
    private claimService: ClaimService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.cdr.markForCheck();

    this.claimService.getUserDashboardStats().subscribe({
      next: (s) => {
        this.stats.set(s);
        this.cdr.markForCheck();
      },
      error: () => {}
    });

    this.claimService.getMyClaims().subscribe({
      next: (claims) => {
        this.recentClaims.set(claims.slice(0, 5));
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
