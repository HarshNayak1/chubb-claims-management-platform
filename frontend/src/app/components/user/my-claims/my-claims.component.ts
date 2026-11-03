import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClaimService } from '../../../services/claim.service';
import { Claim } from '../../../models/claim.model';

@Component({
  selector: 'app-my-claims',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="my-claims-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">My Insurance Claims</h1>
          <p class="page-subtitle">Track, inspect and review status updates for your policy claims</p>
        </div>
        <a routerLink="/user/create-claim" class="btn btn-primary">
          <span>➕ File New Claim</span>
        </a>
      </div>

      <!-- Filter Bar -->
      <div class="card filter-bar">
        <div class="filter-group">
          <label class="filter-label" for="statusFilter">Status Filter:</label>
          <select id="statusFilter" [(ngModel)]="selectedStatus" (change)="applyFilter()" class="form-control filter-select">
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="INFORMATION_REQUIRED">Information Required</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="SETTLED">Settled</option>
          </select>
        </div>
        <div class="claims-count">
          Showing <strong>{{ filteredClaims().length }}</strong> of {{ allClaims().length }} claims
        </div>
      </div>

      <!-- Claims Table Card -->
      <div class="card">
        <div *ngIf="isLoading()" class="state-message">
          Loading your claims...
        </div>

        <div *ngIf="!isLoading() && filteredClaims().length === 0" class="state-message">
          <p *ngIf="allClaims().length === 0">You haven't filed any claims yet.</p>
          <p *ngIf="allClaims().length > 0">No claims match the selected status filter.</p>
          <a *ngIf="allClaims().length === 0" routerLink="/user/create-claim" class="btn btn-primary btn-sm" style="margin-top: 10px;">
            File a Claim Now
          </a>
        </div>

        <div *ngIf="!isLoading() && filteredClaims().length > 0" class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Claim Number</th>
                <th>Type</th>
                <th>Incident Date</th>
                <th>Location</th>
                <th>Estimated Loss</th>
                <th>Current Status</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let claim of filteredClaims()">
                <td>
                  <strong class="claim-ref">{{ claim.claimNumber }}</strong>
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
                <td>{{ claim.updatedAt | date:'mediumDate' }}</td>
                <td>
                  <a [routerLink]="['/user/my-claims', claim.id]" class="btn btn-secondary btn-sm">
                    View Details &rarr;
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
    .filter-bar {
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .filter-label {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--chubb-navy);
    }

    .filter-select {
      width: 220px;
    }

    .claims-count {
      font-size: 0.85rem;
      color: var(--chubb-text-muted);
    }

    .claim-ref {
      color: var(--chubb-navy);
      font-family: monospace;
      font-size: 0.95rem;
    }

    .state-message {
      padding: 40px;
      text-align: center;
      color: var(--chubb-text-muted);
    }
  `]
})
export class MyClaimsComponent implements OnInit {
  allClaims = signal<Claim[]>([]);
  filteredClaims = signal<Claim[]>([]);
  selectedStatus: string = '';
  isLoading = signal<boolean>(true);

  constructor(
    private claimService: ClaimService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.isLoading.set(true);
    this.cdr.markForCheck();
    this.claimService.getMyClaims().subscribe({
      next: (claims) => {
        this.allClaims.set(claims);
        this.applyFilter();
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter(): void {
    const list = this.allClaims();
    if (!this.selectedStatus) {
      this.filteredClaims.set([...list]);
    } else {
      this.filteredClaims.set(list.filter(c => c.status === this.selectedStatus));
    }
    this.cdr.markForCheck();
  }
}
