export type ClaimType = 'MOTOR' | 'PROPERTY';

export type ClaimStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'INFORMATION_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'SETTLED';

export interface ClaimHistory {
  id: number;
  previousStatus: ClaimStatus | null;
  newStatus: ClaimStatus;
  comment: string;
  updatedBy: string;
  createdAt: string;
}

export interface Claim {
  id: number;
  claimNumber: string;
  claimantId?: number;
  claimantName?: string;
  claimantEmail?: string;
  claimType: ClaimType;
  incidentDate: string;
  incidentLocation: string;
  description: string;
  estimatedLoss: number;
  contactNumber: string;
  status: ClaimStatus;
  createdAt: string;
  updatedAt: string;
  history?: ClaimHistory[];
}

export interface ClaimCreateRequest {
  claimType: ClaimType;
  incidentDate: string;
  incidentLocation: string;
  description: string;
  estimatedLoss: number;
  contactNumber: string;
}

export interface StatusUpdateRequest {
  status: ClaimStatus;
  comment: string;
}

export interface DashboardStats {
  totalClaims: number;
  submittedClaims: number;
  underReviewClaims: number;
  infoRequiredClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  settledClaims: number;
  pendingClaims: number;
  totalUsers?: number;
  totalEmployees?: number;
  totalEstimatedLoss?: number;
}
