import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClaimService } from '../../../services/claim.service';
import { Claim, ClaimStatus } from '../../../models/claim.model';

@Component({
  selector: 'app-employee-claims',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="employee-claims-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Claims Queue & Adjudication</h1>
          <p class="page-subtitle">Review, search, filter and adjudicate all submitted insurance claims</p>
        </div>
      </div>

      <!-- Search and Filter Controls -->
      <div class="card filter-container">
        <div class="filter-row">
          <!-- Search By Claim Number -->
          <div class="search-box">
            <label class="form-label" for="claimSearch">Search by Claim Number:</label>
            <div class="input-with-icon">
              <input
                id="claimSearch"
                type="text"
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange()"
                placeholder="e.g. CHB-2026-000001"
                class="form-control"
              />
            </div>
          </div>

          <!-- Filter By Status -->
          <div class="filter-box">
            <label class="form-label" for="statusFilter">Filter by Status:</label>
            <select id="statusFilter" [(ngModel)]="selectedStatus" (change)="onStatusChange()" class="form-control">
              <option value="">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="INFORMATION_REQUIRED">Information Required</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="SETTLED">Settled</option>
            </select>
          </div>

          <!-- Clear Filters -->
          <div class="clear-box">
            <button (click)="resetFilters()" class="btn btn-secondary btn-sm" [disabled]="!searchQuery && !selectedStatus">
              Reset Filters
            </button>
          </div>
        </div>

        <div class="results-summary">
          Found <strong>{{ claims().length }}</strong> claims matching active criteria
        </div>
      </div>

      <!-- Claims Table Card -->
      <div class="card">
        <div *ngIf="isLoading()" class="state-message">
          Retrieving claims database records...
        </div>

        <div *ngIf="!isLoading() && claims().length === 0" class="state-message">
          <p>No claims found matching your filter criteria.</p>
        </div>

        <div *ngIf="!isLoading() && claims().length > 0" class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Claim Reference</th>
                <th>Claimant</th>
                <th>Type</th>
                <th>Incident Date</th>
                <th>Location</th>
                <th>Estimated Loss</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let claim of claims()">
                <td>
                  <strong class="claim-ref">{{ claim.claimNumber }}</strong>
                </td>
                <td>
                  <div class="claimant-info">
                    <span class="claimant-name">{{ claim.claimantName }}</span>
                    <span class="claimant-contact">{{ claim.claimantEmail }}</span>
                    <span class="claimant-contact">{{ claim.contactNumber }}</span>
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
                    Review / Update &rarr;
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
    .filter-container {
      padding: 20px;
    }

    .filter-row {
      display: flex;
      align-items: flex-end;
      gap: 16px;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 260px;
    }

    .filter-box {
      width: 220px;
    }

    .clear-box {
      margin-bottom: 2px;
    }

    .results-summary {
      margin-top: 14px;
      font-size: 0.85rem;
      color: var(--chubb-text-muted);
    }

    .claim-ref {
      font-family: monospace;
      color: var(--chubb-navy);
      font-size: 0.95rem;
    }

    .claimant-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .claimant-name {
      font-weight: 700;
      color: var(--chubb-navy);
      font-size: 0.9rem;
    }

    .claimant-contact {
      font-size: 0.78rem;
      color: var(--chubb-text-muted);
    }

    .state-message {
      padding: 40px;
      text-align: center;
      color: var(--chubb-text-muted);
    }
  `]
})
export class EmployeeClaimsComponent implements OnInit {
  claims = signal<Claim[]>([]);
  searchQuery = '';
  selectedStatus: ClaimStatus | '' = '';
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
    this.claimService.getEmployeeClaims(this.searchQuery, statusParam).subscribe({
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

  onSearchChange(): void {
    this.fetchClaims();
  }

  onStatusChange(): void {
    this.fetchClaims();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.fetchClaims();
  }
}
