import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClaimService } from '../../../services/claim.service';
import { Claim } from '../../../models/claim.model';

@Component({
  selector: 'app-claim-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="claim-details-page">
      <div class="page-header">
        <div>
          <div class="breadcrumb">
            <a routerLink="/user/my-claims">&larr; Back to My Claims</a>
          </div>
          <h1 class="page-title">Claim Ref: {{ claim()?.claimNumber || 'Loading...' }}</h1>
          <p class="page-subtitle">Detailed breakdown of reported incident and evaluation status</p>
        </div>
        <div *ngIf="claim()">
          <span class="badge badge-lg" [ngClass]="'badge-' + claim()!.status">{{ claim()!.status }}</span>
        </div>
      </div>

      <div *ngIf="isLoading()" class="loading-state card">
        Loading claim details...
      </div>

      <div *ngIf="errorMessage()" class="alert alert-danger">
        {{ errorMessage() }}
      </div>

      <div *ngIf="!isLoading() && claim()" class="details-layout">
        <!-- Main Details Column -->
        <div class="main-column">
          <!-- Overview Card -->
          <div class="card">
            <div class="card-title">Incident Details</div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Claim Type</span>
                <span class="info-value">
                  <span class="badge" [ngClass]="'badge-' + claim()!.claimType">{{ claim()!.claimType }} INSURANCE</span>
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Date of Incident</span>
                <span class="info-value">{{ claim()!.incidentDate }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Location of Incident</span>
                <span class="info-value">{{ claim()!.incidentLocation }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Estimated Loss Claimed</span>
                <span class="info-value loss-amount">\${{ claim()!.estimatedLoss | number:'1.2-2' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Policyholder Contact</span>
                <span class="info-value">{{ claim()!.contactNumber }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Submitted On</span>
                <span class="info-value">{{ claim()!.createdAt | date:'medium' }}</span>
              </div>
            </div>

            <div class="description-block">
              <div class="info-label">Incident Description & Narrative</div>
              <div class="description-text">{{ claim()!.description }}</div>
            </div>
          </div>

          <!-- Assessor Review Status & Guidance Card -->
          <div class="card">
            <div class="card-title">Current Status Guidance</div>
            <div [ngSwitch]="claim()!.status">
              <div *ngSwitchCase="'SUBMITTED'" class="status-guidance-box info">
                <h4>Submission Received</h4>
                <p>Your claim has been received by Chubb APAC and queued for assessor allocation. You will receive an update once a claims specialist reviews your documentation.</p>
              </div>
              <div *ngSwitchCase="'UNDER_REVIEW'" class="status-guidance-box warning">
                <h4>Under Active Assessment</h4>
                <p>A Chubb claims specialist is currently assessing the incident circumstances against your policy schedule.</p>
              </div>
              <div *ngSwitchCase="'INFORMATION_REQUIRED'" class="status-guidance-box alert">
                <h4>Additional Documentation Requested</h4>
                <p>The assessor requires further clarification or supporting documents. Please review the comments timeline below.</p>
              </div>
              <div *ngSwitchCase="'APPROVED'" class="status-guidance-box success">
                <h4>Claim Approved</h4>
                <p>Congratulations, your claim has been approved! The settlement disbursement process is in preparation.</p>
              </div>
              <div *ngSwitchCase="'REJECTED'" class="status-guidance-box danger">
                <h4>Claim Declined</h4>
                <p>Your claim has been declined. Please review the detailed assessor comment below for the justification.</p>
              </div>
              <div *ngSwitchCase="'SETTLED'" class="status-guidance-box success">
                <h4>Claim Finalized & Settled</h4>
                <p>Settlement funds have been processed and disbursed. This claim case is complete.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- History & Timeline Column -->
        <div class="side-column">
          <div class="card">
            <div class="card-title">Audit History Timeline</div>
            <p class="history-subtitle">Official records of status updates and adjuster remarks:</p>

            <div *ngIf="!claim()!.history || claim()!.history!.length === 0" class="no-history">
              No historical updates logged yet.
            </div>

            <div *ngIf="claim()!.history && claim()!.history!.length > 0" class="timeline">
              <div *ngFor="let item of claim()!.history" class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <div class="timeline-header">
                    <span class="timeline-user">{{ item.updatedBy }}</span>
                    <span class="timeline-date">{{ item.createdAt | date:'short' }}</span>
                  </div>
                  <div class="timeline-status-transition">
                    <span *ngIf="item.previousStatus" class="badge badge-sm" [ngClass]="'badge-' + item.previousStatus">
                      {{ item.previousStatus }}
                    </span>
                    <span *ngIf="item.previousStatus" class="arrow">&rarr;</span>
                    <span class="badge badge-sm" [ngClass]="'badge-' + item.newStatus">
                      {{ item.newStatus }}
                    </span>
                  </div>
                  <p class="timeline-comment">{{ item.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .breadcrumb {
      margin-bottom: 8px;
    }

    .breadcrumb a {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--chubb-accent);
    }

    .badge-lg {
      font-size: 0.9rem;
      padding: 6px 16px;
    }

    .badge-sm {
      font-size: 0.7rem;
      padding: 2px 6px;
    }

    .details-layout {
      display: grid;
      grid-template-columns: 2fr 1.3fr;
      gap: 24px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-bottom: 24px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-label {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--chubb-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--chubb-navy);
    }

    .loss-amount {
      font-size: 1.25rem;
      color: var(--chubb-navy);
      font-weight: 800;
    }

    .description-block {
      background: #f8fafc;
      border: 1px solid var(--chubb-border);
      border-radius: var(--radius-sm);
      padding: 16px;
    }

    .description-text {
      margin-top: 8px;
      font-size: 0.92rem;
      line-height: 1.6;
      color: var(--chubb-text);
      white-space: pre-wrap;
    }

    .status-guidance-box {
      padding: 16px;
      border-radius: var(--radius-sm);
      border-left: 4px solid;
    }

    .status-guidance-box h4 {
      font-size: 0.95rem;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .status-guidance-box p {
      font-size: 0.88rem;
      line-height: 1.5;
    }

    .status-guidance-box.info {
      background: #f0f9ff;
      border-left-color: #0284c7;
      color: #0369a1;
    }

    .status-guidance-box.warning {
      background: #fffbeb;
      border-left-color: #f59e0b;
      color: #92400e;
    }

    .status-guidance-box.alert {
      background: #f5f3ff;
      border-left-color: #8b5cf6;
      color: #6d28d9;
    }

    .status-guidance-box.success {
      background: #f0fdf4;
      border-left-color: #16a34a;
      color: #15803d;
    }

    .status-guidance-box.danger {
      background: #fef2f2;
      border-left-color: var(--chubb-red);
      color: #991b1b;
    }

    .history-subtitle {
      font-size: 0.82rem;
      color: var(--chubb-text-muted);
      margin-bottom: 16px;
    }

    .timeline-status-transition {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 6px 0;
    }

    .arrow {
      color: var(--chubb-text-muted);
      font-weight: bold;
    }

    .no-history {
      padding: 24px;
      text-align: center;
      color: var(--chubb-text-muted);
      font-size: 0.88rem;
    }

    @media (max-width: 900px) {
      .details-layout {
        grid-template-columns: 1fr;
      }
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ClaimDetailsComponent implements OnInit {
  claim = signal<Claim | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private claimService: ClaimService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadClaim(+id);
    }
  }

  loadClaim(id: number): void {
    this.isLoading.set(true);
    this.cdr.markForCheck();
    this.claimService.getMyClaimById(id).subscribe({
      next: (c) => {
        this.claim.set(c);
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Claim not found or you do not have permission to view this record.');
        this.cdr.markForCheck();
      }
    });
  }
}
