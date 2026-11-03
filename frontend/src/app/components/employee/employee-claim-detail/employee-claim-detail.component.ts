import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClaimService } from '../../../services/claim.service';
import { AuthService } from '../../../services/auth.service';
import { Claim, ClaimStatus } from '../../../models/claim.model';

@Component({
  selector: 'app-employee-claim-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="employee-claim-detail-page">
      <div class="page-header">
        <div>
          <div class="breadcrumb">
            <a routerLink="/employee/claims">&larr; Back to Claims Queue</a>
          </div>
          <h1 class="page-title">Adjudicate Claim: {{ claim()?.claimNumber || 'Loading...' }}</h1>
          <p class="page-subtitle">Assessor Review, Policy Verification, and Status Adjudication</p>
        </div>
        <div *ngIf="claim()">
          <span class="badge badge-lg" [ngClass]="'badge-' + claim()!.status">{{ claim()!.status }}</span>
        </div>
      </div>

      <div *ngIf="isLoading()" class="loading-state card">
        Loading claim details...
      </div>

      <!-- Update Success Alert -->
      <div *ngIf="successMessage()" class="alert alert-success">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>{{ successMessage() }}</span>
      </div>

      <!-- Error Alert -->
      <div *ngIf="errorMessage()" class="alert alert-danger">
        {{ errorMessage() }}
      </div>

      <div *ngIf="!isLoading() && claim()" class="detail-grid">
        <!-- Left Column: Claim & Claimant Details -->
        <div class="info-section">
          <!-- Claimant Profile Card -->
          <div class="card">
            <div class="card-title">Policyholder Claimant Profile</div>
            <div class="profile-row">
              <div class="profile-item">
                <span class="label">Full Name</span>
                <span class="val font-bold">{{ claim()!.claimantName }}</span>
              </div>
              <div class="profile-item">
                <span class="label">Registered Email</span>
                <span class="val">{{ claim()!.claimantEmail }}</span>
              </div>
              <div class="profile-item">
                <span class="label">Direct Contact Phone</span>
                <span class="val font-bold">{{ claim()!.contactNumber }}</span>
              </div>
              <div class="profile-item">
                <span class="label">Security Privacy Status</span>
                <span class="val text-muted">Protected Account (Credentials Encrypted)</span>
              </div>
            </div>
          </div>

          <!-- Incident Particulars Card -->
          <div class="card">
            <div class="card-title">Incident Particulars</div>
            <div class="profile-row">
              <div class="profile-item">
                <span class="label">Claim Type</span>
                <span class="val">
                  <span class="badge" [ngClass]="'badge-' + claim()!.claimType">{{ claim()!.claimType }}</span>
                </span>
              </div>
              <div class="profile-item">
                <span class="label">Incident Date</span>
                <span class="val">{{ claim()!.incidentDate }}</span>
              </div>
              <div class="profile-item">
                <span class="label">Incident Location</span>
                <span class="val">{{ claim()!.incidentLocation }}</span>
              </div>
              <div class="profile-item">
                <span class="label">Estimated Loss Claimed</span>
                <span class="val loss-highlight">\${{ claim()!.estimatedLoss | number:'1.2-2' }}</span>
              </div>
            </div>

            <div class="desc-box">
              <div class="label">Incident Description & Narrative</div>
              <p class="desc-content">{{ claim()!.description }}</p>
            </div>
          </div>

          <!-- Audit Timeline -->
          <div class="card">
            <div class="card-title">Audit History Timeline (Assessor Logs)</div>
            <div *ngIf="!claim()!.history || claim()!.history!.length === 0" class="no-history">
              No previous audit records found.
            </div>

            <div *ngIf="claim()!.history && claim()!.history!.length > 0" class="timeline">
              <div *ngFor="let h of claim()!.history" class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <div class="timeline-header">
                    <span class="timeline-user">{{ h.updatedBy }}</span>
                    <span class="timeline-date">{{ h.createdAt | date:'medium' }}</span>
                  </div>
                  <div class="status-change-badges">
                    <span *ngIf="h.previousStatus" class="badge" [ngClass]="'badge-' + h.previousStatus">
                      {{ h.previousStatus }}
                    </span>
                    <span *ngIf="h.previousStatus" class="arrow">&rarr;</span>
                    <span class="badge" [ngClass]="'badge-' + h.newStatus">
                      {{ h.newStatus }}
                    </span>
                  </div>
                  <p class="timeline-comment">{{ h.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Status Update Action Panel -->
        <div class="action-section">
          <div class="card sticky-panel">
            <div class="card-title">
              <span>Adjudicate / Update Status</span>
            </div>
            <p class="panel-instructions">
              Every status change is permanently audited with your Assessor Employee ID, date/time stamp, and reason.
            </p>

            <form [formGroup]="statusForm" (ngSubmit)="onUpdateStatus()">
              <div class="form-group">
                <label class="form-label" for="newStatus">New Claim Status *</label>
                <select
                  id="newStatus"
                  class="form-control"
                  [class.is-invalid]="f['status'].touched && f['status'].invalid"
                  formControlName="status"
                >
                  <option value="SUBMITTED">SUBMITTED (Pending review)</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW (Active assessor investigation)</option>
                  <option value="INFORMATION_REQUIRED">INFORMATION_REQUIRED (Request info from user)</option>
                  <option value="APPROVED">APPROVED (Approve coverage schedule)</option>
                  <option value="REJECTED">REJECTED (Decline claim)</option>
                  <option value="SETTLED">SETTLED (Disbursement completed)</option>
                </select>
                <div *ngIf="f['status'].touched && f['status'].invalid" class="form-error">
                  Status selection is required.
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="comment">Assessor Comment / Audit Justification *</label>
                <textarea
                  id="comment"
                  rows="4"
                  class="form-control"
                  [class.is-invalid]="f['comment'].touched && f['comment'].invalid"
                  formControlName="comment"
                  placeholder="Detail assessment findings, required documents, or settlement details..."
                ></textarea>
                <div *ngIf="f['comment'].touched && f['comment'].invalid" class="form-error">
                  Comment is required for auditing purposes.
                </div>
              </div>

              <div class="assessor-id-tag">
                Assessor: <strong>{{ authService.currentUserName() }}</strong> ({{ authService.currentUser()?.email }})
              </div>

              <button
                type="submit"
                [disabled]="statusForm.invalid || isUpdating()"
                class="btn btn-primary btn-block"
              >
                <span *ngIf="!isUpdating()">Confirm & Record Status Update</span>
                <span *ngIf="isUpdating()">Updating Record...</span>
              </button>
            </form>
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
      font-size: 0.95rem;
      padding: 6px 16px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 2fr 1.2fr;
      gap: 24px;
    }

    .profile-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .profile-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .label {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--chubb-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .val {
      font-size: 0.95rem;
      color: var(--chubb-navy);
    }

    .font-bold {
      font-weight: 700;
    }

    .loss-highlight {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--chubb-navy);
    }

    .desc-box {
      background: #f8fafc;
      border: 1px solid var(--chubb-border);
      border-radius: var(--radius-sm);
      padding: 16px;
      margin-top: 12px;
    }

    .desc-content {
      margin-top: 8px;
      font-size: 0.92rem;
      line-height: 1.6;
      color: var(--chubb-text);
      white-space: pre-wrap;
    }

    .sticky-panel {
      position: sticky;
      top: 88px;
    }

    .panel-instructions {
      font-size: 0.85rem;
      color: var(--chubb-text-muted);
      margin-bottom: 20px;
      line-height: 1.4;
    }

    .assessor-id-tag {
      background: #f1f5f9;
      border: 1px solid var(--chubb-border);
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      color: var(--chubb-navy);
      margin-bottom: 18px;
    }

    .btn-block {
      width: 100%;
      padding: 12px;
    }

    .status-change-badges {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 6px 0;
    }

    .arrow {
      color: var(--chubb-text-muted);
      font-weight: bold;
    }

    @media (max-width: 900px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }
      .profile-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeClaimDetailComponent implements OnInit {
  claim = signal<Claim | null>(null);
  statusForm: FormGroup;
  isLoading = signal<boolean>(true);
  isUpdating = signal<boolean>(false);
  successMessage = signal<string>('');
  errorMessage = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private claimService: ClaimService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) {
    this.statusForm = this.fb.group({
      status: ['', [Validators.required]],
      comment: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  get f() {
    return this.statusForm.controls;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadClaim(+id);
    }
  }

  loadClaim(id: number): void {
    this.isLoading.set(true);
    this.cdr.markForCheck();
    this.claimService.getEmployeeClaimById(id).subscribe({
      next: (c) => {
        this.claim.set(c);
        this.statusForm.patchValue({
          status: c.status
        });
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load claim. Please try again.');
        this.cdr.markForCheck();
      }
    });
  }

  onUpdateStatus(): void {
    const currentClaim = this.claim();
    if (this.statusForm.invalid || !currentClaim) {
      this.statusForm.markAllAsTouched();
      return;
    }

    this.isUpdating.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');
    this.cdr.markForCheck();

    const req = {
      status: this.statusForm.value.status as ClaimStatus,
      comment: this.statusForm.value.comment
    };

    this.claimService.updateClaimStatus(currentClaim.id, req).subscribe({
      next: (updated) => {
        this.isUpdating.set(false);
        this.claim.set(updated);
        this.statusForm.get('comment')?.reset();
        this.successMessage.set(`Claim status successfully updated to ${updated.status} and audited in permanent log.`);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isUpdating.set(false);
        if (err.error && err.error.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('Failed to update claim status. Please verify entries.');
        }
        this.cdr.markForCheck();
      }
    });
  }
}
