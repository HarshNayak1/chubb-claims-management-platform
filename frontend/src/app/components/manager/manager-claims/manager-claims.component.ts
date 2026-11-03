import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClaimService } from '../../../services/claim.service';
import { Claim, ClaimStatus } from '../../../models/claim.model';

@Component({
  selector: 'app-manager-claims',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="manager-claims-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Claims Portfolio Register</h1>
          <p class="page-subtitle">Managerial view of all insurance claims registered in Chubb APAC</p>
        </div>
        <a routerLink="/manager/dashboard" class="btn btn-secondary">
          &larr; Back to Dashboard
        </a>
      </div>

      <!-- Search and Filter Bar -->
      <div class="card filter-container">
        <div class="filter-row">
          <div class="search-box">
            <label class="form-label" for="claimSearch">Search Claim Reference:</label>
            <input
              id="claimSearch"
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onFilterChange()"
              placeholder="e.g. CHB-2026-000001"
              class="form-control"
            />
          </div>

          <div class="filter-box">
            <label class="form-label" for="statusSelect">Filter by Status:</label>
            <select id="statusSelect" [(ngModel)]="selectedStatus" (change)="onFilterChange()" class="form-control">
              <option value="">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="INFORMATION_REQUIRED">Information Required</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="SETTLED">Settled</option>
            </select>
          </div>

          <div class="clear-box">
            <button (click)="resetFilters()" class="btn btn-secondary btn-sm" [disabled]="!searchQuery && !selectedStatus">
              Reset Filters
            </button>
          </div>
        </div>
        <div class="claims-total-badge">
          Showing <strong>{{ claims().length }}</strong> claims
        </div>
      </div>

      <!-- Claims Table -->
      <div class="card">
        <div *ngIf="isLoading()" class="state-msg">
          Loading claims portfolio...
        </div>

        <div *ngIf="!isLoading() && claims().length === 0" class="state-msg">
          No claims match the specified search or filter.
        </div>

        <div *ngIf="!isLoading() && claims().length > 0" class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Claimant</th>
                <th>Policy Type</th>
                <th>Incident Date</th>
                <th>Location</th>
                <th>Estimated Loss</th>
                <th>Status</th>
                <th>History Audit</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let claim of claims()">
                <td>
                  <strong class="claim-ref">{{ claim.claimNumber }}</strong>
                </td>
                <td>
                  <div class="user-cell">
                    <span class="user-name">{{ claim.claimantName }}</span>
                    <span class="user-sub">{{ claim.claimantEmail }}</span>
                  </div>
                </td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + claim.claimType">{{ claim.claimType }}</span>
                </td>
                <td>{{ claim.incidentDate }}</td>
                <td>{{ claim.incidentLocation }}</td>
                <td>
                  <span class="loss-val">\${{ claim.estimatedLoss | number:'1.2-2' }}</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + claim.status">{{ claim.status }}</span>
                </td>
                <td>
                  <button (click)="openAuditModal(claim)" class="btn btn-outline btn-sm">
                    Inspect ({{ claim.history?.length || 0 }})
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal for Audit History View -->
      <div *ngIf="selectedClaim()" class="modal-backdrop" (click)="closeModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h3>Claim Ref: {{ selectedClaim()?.claimNumber }}</h3>
              <p class="modal-sub">Policyholder: {{ selectedClaim()?.claimantName }} ({{ selectedClaim()?.claimantEmail }})</p>
            </div>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>

          <div class="modal-body">
            <div class="modal-overview-grid">
              <div><strong>Type:</strong> {{ selectedClaim()?.claimType }}</div>
              <div><strong>Date:</strong> {{ selectedClaim()?.incidentDate }}</div>
              <div><strong>Location:</strong> {{ selectedClaim()?.incidentLocation }}</div>
              <div><strong>Amount:</strong> \${{ selectedClaim()?.estimatedLoss | number:'1.2-2' }}</div>
              <div><strong>Phone:</strong> {{ selectedClaim()?.contactNumber }}</div>
              <div><strong>Status:</strong> <span class="badge" [ngClass]="'badge-' + selectedClaim()?.status">{{ selectedClaim()?.status }}</span></div>
            </div>

            <div class="modal-desc">
              <strong>Incident Description:</strong>
              <p>{{ selectedClaim()?.description }}</p>
            </div>

            <div class="modal-timeline-header">
              <h4>Complete Historical Audit Trail</h4>
            </div>

            <div *ngIf="!selectedClaim()?.history || selectedClaim()?.history?.length === 0" class="no-hist">
              No audit records.
            </div>

            <div *ngIf="selectedClaim()?.history && selectedClaim()!.history!.length > 0" class="timeline">
              <div *ngFor="let h of selectedClaim()!.history" class="timeline-item">
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

          <div class="modal-footer">
            <button (click)="closeModal()" class="btn btn-secondary">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-container {
      padding: 18px 20px;
    }

    .filter-row {
      display: flex;
      align-items: flex-end;
      gap: 16px;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 250px;
    }

    .filter-box {
      width: 220px;
    }

    .claims-total-badge {
      margin-top: 14px;
      font-size: 0.85rem;
      color: var(--chubb-text-muted);
    }

    .claim-ref {
      font-family: monospace;
      color: var(--chubb-navy);
      font-size: 0.95rem;
    }

    .user-cell {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 600;
      color: var(--chubb-navy);
    }

    .user-sub {
      font-size: 0.78rem;
      color: var(--chubb-text-muted);
    }

    .loss-val {
      font-weight: 700;
      color: var(--chubb-navy);
    }

    .state-msg {
      padding: 40px;
      text-align: center;
      color: var(--chubb-text-muted);
    }

    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 26, 44, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-card {
      background: white;
      border-radius: var(--radius-md);
      width: 100%;
      max-width: 750px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
    }

    .modal-header {
      background: var(--chubb-navy);
      color: white;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 4px solid var(--chubb-red);
    }

    .modal-header h3 {
      font-size: 1.25rem;
      font-weight: 800;
    }

    .modal-sub {
      font-size: 0.82rem;
      color: #cbd5e1;
      margin-top: 2px;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: white;
      font-size: 1.8rem;
      line-height: 1;
      cursor: pointer;
    }

    .modal-body {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
    }

    .modal-overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      padding-bottom: 16px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--chubb-border);
      font-size: 0.9rem;
    }

    .modal-desc {
      background: #f8fafc;
      padding: 14px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--chubb-border);
      margin-bottom: 20px;
      font-size: 0.88rem;
    }

    .modal-desc p {
      margin-top: 6px;
      line-height: 1.5;
    }

    .modal-timeline-header h4 {
      font-size: 1rem;
      font-weight: 700;
      color: var(--chubb-navy);
      margin-bottom: 12px;
    }

    .modal-footer {
      padding: 16px 24px;
      background: #f8fafc;
      border-top: 1px solid var(--chubb-border);
      display: flex;
      justify-content: flex-end;
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
  `]
})
export class ManagerClaimsComponent implements OnInit {
  claims = signal<Claim[]>([]);
  searchQuery = '';
  selectedStatus: ClaimStatus | '' = '';
  selectedClaim = signal<Claim | null>(null);
  isLoading = signal<boolean>(true);

  constructor(
    private claimService: ClaimService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchClaims();
  }

  fetchClaims(): void {
    this.isLoading.set(true);
    this.cdr.markForCheck();
    const statusParam = this.selectedStatus ? (this.selectedStatus as ClaimStatus) : undefined;
    this.claimService.getManagerClaims(this.searchQuery, statusParam).subscribe({
      next: (data) => {
        this.claims.set(data);
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  onFilterChange(): void {
    this.fetchClaims();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.fetchClaims();
  }

  openAuditModal(claim: Claim): void {
    this.selectedClaim.set(claim);
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.selectedClaim.set(null);
    this.cdr.markForCheck();
  }
}
