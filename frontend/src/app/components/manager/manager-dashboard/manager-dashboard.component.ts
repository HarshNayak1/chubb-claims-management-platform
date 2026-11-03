import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClaimService } from '../../../services/claim.service';
import { AuthService } from '../../../services/auth.service';
import { DashboardStats } from '../../../models/claim.model';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="manager-dashboard">
      <div class="page-header">
        <div>
          <h1 class="page-title">Executive Operations Dashboard</h1>
          <p class="page-subtitle">Chubb APAC Claims Portfolio & Resource Management</p>
        </div>
        <div class="header-actions">
          <a routerLink="/manager/claims" class="btn btn-secondary">
            <span>🗂️ All Claims</span>
          </a>
          <a routerLink="/manager/users" class="btn btn-secondary">
            <span>👥 Claimants ({{ stats()?.totalUsers || 0 }})</span>
          </a>
          <a routerLink="/manager/employees" class="btn btn-secondary">
            <span>👔 Staff ({{ stats()?.totalEmployees || 0 }})</span>
          </a>
        </div>
      </div>

      <div *ngIf="isLoading()" class="loading-state card">
        Loading real-time executive metrics...
      </div>

      <div *ngIf="!isLoading()">
        <!-- High-level KPIs -->
        <div class="stats-grid">
          <div class="stat-card accent-blue">
            <div class="stat-label">Total Claims Registered</div>
            <div class="stat-value">{{ stats()?.totalClaims || 0 }}</div>
          </div>
          <div class="stat-card accent-amber">
            <div class="stat-label">Pending Adjudication</div>
            <div class="stat-value">{{ stats()?.pendingClaims || 0 }}</div>
          </div>
          <div class="stat-card accent-green">
            <div class="stat-label">Approved Claims</div>
            <div class="stat-value">{{ stats()?.approvedClaims || 0 }}</div>
          </div>
          <div class="stat-card accent-red">
            <div class="stat-label">Rejected Claims</div>
            <div class="stat-value">{{ stats()?.rejectedClaims || 0 }}</div>
          </div>
          <div class="stat-card accent-teal">
            <div class="stat-label">Settled & Finalized</div>
            <div class="stat-value">{{ stats()?.settledClaims || 0 }}</div>
          </div>
          <div class="stat-card accent-blue">
            <div class="stat-label">Total Portfolio Exposure</div>
            <div class="stat-value font-currency">
              \${{ stats()?.totalEstimatedLoss || 0 | number:'1.2-2' }}
            </div>
          </div>
        </div>

        <!-- Resource Breakdown Cards -->
        <div class="resource-grid">
          <div class="card">
            <div class="card-title">
              <span>Claims Workflow Pipeline</span>
              <span class="badge badge-role">Real Database Records</span>
            </div>
            <div class="pipeline-list">
              <div class="pipeline-item">
                <span class="pipeline-name">
                  <span class="dot submitted-dot"></span> Submitted (Awaiting Assessor)
                </span>
                <span class="pipeline-val">{{ stats()?.submittedClaims || 0 }}</span>
              </div>
              <div class="pipeline-item">
                <span class="pipeline-name">
                  <span class="dot review-dot"></span> Under Active Investigation
                </span>
                <span class="pipeline-val">{{ stats()?.underReviewClaims || 0 }}</span>
              </div>
              <div class="pipeline-item">
                <span class="pipeline-name">
                  <span class="dot info-dot"></span> Information Required from User
                </span>
                <span class="pipeline-val">{{ stats()?.infoRequiredClaims || 0 }}</span>
              </div>
              <div class="pipeline-item">
                <span class="pipeline-name">
                  <span class="dot approved-dot"></span> Approved for Settlement
                </span>
                <span class="pipeline-val">{{ stats()?.approvedClaims || 0 }}</span>
              </div>
              <div class="pipeline-item">
                <span class="pipeline-name">
                  <span class="dot rejected-dot"></span> Rejected
                </span>
                <span class="pipeline-val">{{ stats()?.rejectedClaims || 0 }}</span>
              </div>
              <div class="pipeline-item">
                <span class="pipeline-name">
                  <span class="dot settled-dot"></span> Settled & Closed
                </span>
                <span class="pipeline-val">{{ stats()?.settledClaims || 0 }}</span>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-title">Directory Management Overview</div>
            <div class="directory-summary">
              <div class="directory-box">
                <div class="dir-icon">👥</div>
                <div class="dir-content">
                  <div class="dir-val">{{ stats()?.totalUsers || 0 }}</div>
                  <div class="dir-label">Registered Policyholders</div>
                  <a routerLink="/manager/users" class="btn btn-outline btn-sm" style="margin-top: 8px;">
                    View All Users &rarr;
                  </a>
                </div>
              </div>

              <div class="directory-box">
                <div class="dir-icon">👔</div>
                <div class="dir-content">
                  <div class="dir-val">{{ stats()?.totalEmployees || 0 }}</div>
                  <div class="dir-label">Assessor Staff Members</div>
                  <a routerLink="/manager/employees" class="btn btn-outline btn-sm" style="margin-top: 8px;">
                    View Claims Staff &rarr;
                  </a>
                </div>
              </div>
            </div>

            <div class="compliance-note">
              <strong>Security Compliance Note:</strong>
              <span>Manager role has strictly read-only access to user directories in Version 1. User and employee passwords are encrypted with BCrypt and protected.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .font-currency {
      font-size: 1.5rem !important;
      color: #0f766e !important;
    }

    .resource-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .pipeline-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
    }

    .pipeline-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background: #f8fafc;
      border: 1px solid var(--chubb-border);
      border-radius: var(--radius-sm);
    }

    .pipeline-name {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--chubb-navy);
    }

    .pipeline-val {
      font-weight: 800;
      font-size: 1.05rem;
      color: var(--chubb-navy);
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .submitted-dot { background-color: #0284c7; }
    .review-dot { background-color: #d97706; }
    .info-dot { background-color: #7c3aed; }
    .approved-dot { background-color: #16a34a; }
    .rejected-dot { background-color: #b91c1c; }
    .settled-dot { background-color: #0d9488; }

    .directory-summary {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 16px 0;
    }

    .directory-box {
      background: #f8fafc;
      border: 1px solid var(--chubb-border);
      border-radius: var(--radius-sm);
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .dir-icon {
      font-size: 2rem;
    }

    .dir-val {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--chubb-navy);
    }

    .dir-label {
      font-size: 0.8rem;
      color: var(--chubb-text-muted);
      font-weight: 600;
    }

    .compliance-note {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      padding: 12px 14px;
      border-radius: var(--radius-sm);
      font-size: 0.82rem;
      color: #0369a1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 16px;
    }

    .loading-state {
      padding: 40px;
      text-align: center;
      color: var(--chubb-text-muted);
    }

    @media (max-width: 900px) {
      .resource-grid {
        grid-template-columns: 1fr;
      }
      .directory-summary {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ManagerDashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  isLoading = signal<boolean>(true);

  constructor(
    public authService: AuthService,
    private claimService: ClaimService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading.set(true);
    this.cdr.markForCheck();
    this.claimService.getManagerDashboardStats().subscribe({
      next: (s) => {
        this.stats.set(s);
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
