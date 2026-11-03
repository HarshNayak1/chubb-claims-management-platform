import { Component, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClaimService } from '../../../services/claim.service';
import { Claim } from '../../../models/claim.model';

@Component({
  selector: 'app-create-claim',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="create-claim-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">File an Insurance Claim</h1>
          <p class="page-subtitle">Submit incident details for Chubb claims appraisal and processing</p>
        </div>
        <a routerLink="/user/my-claims" class="btn btn-secondary">
          &larr; Back to My Claims
        </a>
      </div>

      <!-- Success Confirmation Banner -->
      <div *ngIf="createdClaim()" class="card success-card">
        <div class="success-header">
          <div class="success-icon">✓</div>
          <div>
            <h3>Claim Successfully Submitted!</h3>
            <p>Your unique Chubb claim reference number has been generated:</p>
          </div>
        </div>
        <div class="claim-number-display">
          {{ createdClaim()?.claimNumber }}
        </div>
        <p class="success-note">
          A Chubb claims assessor will review your claim under reference <strong>{{ createdClaim()?.claimNumber }}</strong>.
          You can track status updates in your dashboard.
        </p>
        <div class="success-actions">
          <a [routerLink]="['/user/my-claims', createdClaim()?.id]" class="btn btn-primary">
            View Claim Details
          </a>
          <button (click)="resetForm()" class="btn btn-secondary">
            File Another Claim
          </button>
        </div>
      </div>

      <!-- Claim Submission Form -->
      <div *ngIf="!createdClaim()" class="card">
        <div class="card-title">Incident & Policy Details</div>

        <!-- General Error Alert -->
        <div *ngIf="errorMessage()" class="alert alert-danger">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>
            <strong>Submission Error:</strong>
            <div>{{ errorMessage() }}</div>
          </div>
        </div>

        <form [formGroup]="claimForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <!-- Claim Type -->
            <div class="form-group">
              <label class="form-label" for="claimType">Claim Policy Type *</label>
              <select
                id="claimType"
                class="form-control"
                [class.is-invalid]="f['claimType'].touched && f['claimType'].invalid"
                formControlName="claimType"
              >
                <option value="MOTOR">Motor Insurance (Vehicle Collision, Damage, Theft)</option>
                <option value="PROPERTY">Property Insurance (Home, Fire, Water, Structural Damage)</option>
              </select>
              <div *ngIf="f['claimType'].touched && f['claimType'].invalid" class="form-error">
                Please select a valid claim type.
              </div>
            </div>

            <!-- Incident Date -->
            <div class="form-group">
              <label class="form-label" for="incidentDate">Incident Date *</label>
              <input
                id="incidentDate"
                type="date"
                class="form-control"
                [class.is-invalid]="f['incidentDate'].touched && f['incidentDate'].invalid"
                formControlName="incidentDate"
              />
              <div *ngIf="f['incidentDate'].touched && f['incidentDate'].invalid" class="form-error">
                Incident date is required.
              </div>
            </div>

            <!-- Incident Location -->
            <div class="form-group">
              <label class="form-label" for="incidentLocation">Incident Location *</label>
              <input
                id="incidentLocation"
                type="text"
                class="form-control"
                [class.is-invalid]="f['incidentLocation'].touched && f['incidentLocation'].invalid"
                formControlName="incidentLocation"
                placeholder="e.g. Marina Boulevard, Singapore or Collins St, Melbourne"
              />
              <div *ngIf="f['incidentLocation'].touched && f['incidentLocation'].invalid" class="form-error">
                Incident location is required.
              </div>
            </div>

            <!-- Estimated Loss Amount -->
            <div class="form-group">
              <label class="form-label" for="estimatedLoss">Estimated Loss Amount ($ USD / AUD / SGD) *</label>
              <input
                id="estimatedLoss"
                type="number"
                step="0.01"
                min="1"
                class="form-control"
                [class.is-invalid]="f['estimatedLoss'].touched && f['estimatedLoss'].invalid"
                formControlName="estimatedLoss"
                placeholder="e.g. 3500.00"
              />
              <div *ngIf="f['estimatedLoss'].touched && f['estimatedLoss'].invalid" class="form-error">
                Estimated loss amount must be greater than zero.
              </div>
            </div>

            <!-- Contact Number -->
            <div class="form-group full-width">
              <label class="form-label" for="contactNumber">Primary Contact Phone Number *</label>
              <input
                id="contactNumber"
                type="tel"
                class="form-control"
                [class.is-invalid]="f['contactNumber'].touched && f['contactNumber'].invalid"
                formControlName="contactNumber"
                placeholder="e.g. +65 9123 4567 or +61 412 345 678"
              />
              <div *ngIf="f['contactNumber'].touched && f['contactNumber'].invalid" class="form-error">
                Contact phone number is required.
              </div>
            </div>

            <!-- Incident Description -->
            <div class="form-group full-width">
              <label class="form-label" for="description">Detailed Description of Incident & Circumstances *</label>
              <textarea
                id="description"
                rows="5"
                class="form-control"
                [class.is-invalid]="f['description'].touched && f['description'].invalid"
                formControlName="description"
                placeholder="Please describe exactly what happened, extent of visible damage, any third parties involved, and emergency actions taken..."
              ></textarea>
              <div *ngIf="f['description'].touched && f['description'].invalid" class="form-error">
                Detailed description is required (at least 10 characters).
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" routerLink="/user/my-claims" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" [disabled]="claimForm.invalid || isSubmitting()" class="btn btn-danger">
              <span *ngIf="!isSubmitting()">Submit Insurance Claim</span>
              <span *ngIf="isSubmitting()">Submitting Claim...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 18px;
      border-top: 1px solid var(--chubb-border);
    }

    .success-card {
      border: 2px solid #86efac;
      background: #f0fdf4;
      padding: 32px;
      text-align: center;
    }

    .success-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .success-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #16a34a;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 800;
    }

    .claim-number-display {
      font-size: 2.2rem;
      font-weight: 900;
      color: var(--chubb-navy);
      letter-spacing: 2px;
      background: white;
      padding: 16px 28px;
      border-radius: var(--radius-md);
      display: inline-block;
      border: 2px dashed #16a34a;
      margin-bottom: 16px;
    }

    .success-note {
      font-size: 0.95rem;
      color: #166534;
      max-width: 600px;
      margin: 0 auto 24px auto;
    }

    .success-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CreateClaimComponent {
  claimForm: FormGroup;
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');
  createdClaim = signal<Claim | null>(null);

  constructor(
    private fb: FormBuilder,
    private claimService: ClaimService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.claimForm = this.fb.group({
      claimType: ['MOTOR', [Validators.required]],
      incidentDate: [today, [Validators.required]],
      incidentLocation: ['', [Validators.required]],
      estimatedLoss: ['', [Validators.required, Validators.min(0.01)]],
      contactNumber: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get f() {
    return this.claimForm.controls;
  }

  resetForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.createdClaim.set(null);
    this.errorMessage.set('');
    this.isSubmitting.set(false);
    this.claimForm.reset({
      claimType: 'MOTOR',
      incidentDate: today
    });
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (this.claimForm.invalid) {
      this.claimForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.cdr.markForCheck();

    this.claimService.createClaim(this.claimForm.value).subscribe({
      next: (claim) => {
        this.isSubmitting.set(false);
        this.createdClaim.set(claim);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 0) {
          this.errorMessage.set('Cannot connect to backend at http://localhost:8080. Please ensure the Spring Boot server is running.');
        } else if (err.status === 401) {
          this.errorMessage.set('Your session has expired. Please log in again.');
        } else if (err.error?.validationErrors) {
          const detail = Object.entries(err.error.validationErrors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join('; ');
          this.errorMessage.set(`Validation error: ${detail}`);
        } else if (err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('An unexpected error occurred while filing the claim. Please check your inputs and try again.');
        }
        this.cdr.markForCheck();
      }
    });
  }
}
