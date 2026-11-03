import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Claim,
  ClaimCreateRequest,
  ClaimStatus,
  DashboardStats,
  StatusUpdateRequest
} from '../models/claim.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private readonly BASE_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // USER API
  createClaim(claim: ClaimCreateRequest): Observable<Claim> {
    return this.http.post<Claim>(`${this.BASE_URL}/user/claims`, claim);
  }

  getMyClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.BASE_URL}/user/claims`);
  }

  getMyClaimById(id: number): Observable<Claim> {
    return this.http.get<Claim>(`${this.BASE_URL}/user/claims/${id}`);
  }

  getUserDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.BASE_URL}/user/dashboard`);
  }

  // EMPLOYEE API
  getEmployeeClaims(query?: string, status?: ClaimStatus): Observable<Claim[]> {
    let params = new HttpParams();
    if (query && query.trim()) {
      params = params.set('query', query.trim());
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Claim[]>(`${this.BASE_URL}/employee/claims`, { params });
  }

  getEmployeeClaimById(id: number): Observable<Claim> {
    return this.http.get<Claim>(`${this.BASE_URL}/employee/claims/${id}`);
  }

  updateClaimStatus(id: number, request: StatusUpdateRequest): Observable<Claim> {
    return this.http.put<Claim>(`${this.BASE_URL}/employee/claims/${id}/status`, request);
  }

  getEmployeeDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.BASE_URL}/employee/dashboard`);
  }

  // MANAGER API
  getManagerDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.BASE_URL}/manager/dashboard`);
  }

  getManagerClaims(query?: string, status?: ClaimStatus): Observable<Claim[]> {
    let params = new HttpParams();
    if (query && query.trim()) {
      params = params.set('query', query.trim());
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Claim[]>(`${this.BASE_URL}/manager/claims`, { params });
  }

  getManagerClaimById(id: number): Observable<Claim> {
    return this.http.get<Claim>(`${this.BASE_URL}/manager/claims/${id}`);
  }

  getRegisteredUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.BASE_URL}/manager/users`);
  }

  getStaffEmployees(): Observable<User[]> {
    return this.http.get<User[]>(`${this.BASE_URL}/manager/employees`);
  }
}
