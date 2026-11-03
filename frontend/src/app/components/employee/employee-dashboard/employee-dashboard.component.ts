import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClaimService } from '../../../services/claim.service';
import { AuthService } from '../../../services/auth.service';
import { Claim, DashboardStats } from '../../../models/claim.model';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="employee-dashboard">
      <div class="page-header">
        <div>
          <h1 class="page-title">Claims Assessment Console</h1>
          <p class="page-subtitle">Logged in as Claims Assessor: <strong>{{ authService.currentUserName() }}</strong></p>
        </div>
        <a routerLink="/employee/claims" class="btn btn-primary">
          <span>📋 Open Full Claims Queue</span>
        </a>
      </div>

      <!-- Quick KPI Row -->
      <div class="stats-grid">
        <div class="stat-card accent-blue">
          <div class="stat-label">Total Claims Pool</div>
          <div class="stat-value">{{ stats()?.totalClaims || 0 }}</div>
        </div>
        <div class="stat-card accent-amber">
          <div class="stat-label">Submitted (Pending Allocation)</div>
          <div class="stat-value">{{ stats()?.submittedClaims || 0 }}</div>
        </div>
        <div class="stat-card accent-purple">
          <div class="stat-label">Under Active Review</div>
          <div class="stat-value">{{ stats()?.underReviewClaims || 0 }}</div>
        </div>
        <div class="stat-card accent-amber">
          <div class="stat-label">Info Required</div>
          <div class="stat-value">{{ stats()?.infoRequiredClaims || 0 }}</div>
        </div>
        <div class="stat-card accent-green">
          <div class="stat-label">Approved</div>
          <div class="stat-value">{{ stats()?.approvedClaims || 0 }}</div>
        </div>
        <div class="stat-card accent-teal">
          <div class="stat-label">Settled</div>
          <div class="stat-value">{{ stats()?.settledClaims || 0 }}</div>
        </div>
      </div>

      <!-- Priority Worklist -->
      <div class="card">
        <div class="card-title">
          <span>Priority Claims Requiring Review</span>
          <a routerLink="/employee/claims" class="view-all-link">View All Active Claims &rarr;</a>
        </div>

        <div *ngIf="isLoading()" class="loading-state">
          Loading priority assessment queue...
        </div>

        <div *ngIf="!isLoading() && priorityClaims().length === 0" class="empty-state">
          No new or under-review claims pending at this time.
        </div>

        <div *ngIf="!isLoading() && priorityClaims().length > 0" class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Claim Ref</th>
                <th>Claimant</th>
                <th>Type</th>
                <th>Incident Date</th>
                <th>Location</th>
                <th>Estimated Loss</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let claim of priorityClaims()">
                <td>
                  <strong class="claim-ref">{{ claim.claimNumber }}</strong>
                </td>
                <td>
                  <div class="claimant-cell">
                    <span class="claimant-name">{{ claim.claimantName }}</span>
                    <span class="claimant-email">{{ claim.claimantEmail }}</span>
                  </div>
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
                  <a [routerLink]="['/employee/claims', claim.id]" class="btn btn-primary btn-sm">
                    Assess &rarr;
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
    .claimant-cell {
      display: flex;
      flex-direction: column;
    }

    .claimant-name {
      font-weight: 600;
      color: var(--chubb-navy);
    }

    .claimant-email {
      font-size: 0.78rem;
      color: var(--chubb-text-muted);
    }

    .claim-ref {
      font-family: monospace;
      color: var(--chubb-navy);
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
export class EmployeeDashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  priorityClaims = signal<Claim[]>([]);
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

    this.claimService.getEmployeeDashboardStats().subscribe({
      next: (s) => {
        this.stats.set(s);
        this.cdr.markForCheck();
      },
      error: () => {}
    });

    this.claimService.getEmployeeClaims().subscribe({
      next: (claims) => {
        this.priorityClaims.set(
          claims
            .filter(c => ['SUBMITTED', 'UNDER_REVIEW', 'INFORMATION_REQUIRED'].includes(c.status))
            .slice(0, 8)
        );
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
