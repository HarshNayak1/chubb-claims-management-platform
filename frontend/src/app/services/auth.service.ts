import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse, Role } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'chubb_auth_token';
  private readonly USER_KEY = 'chubb_user_data';

  currentUser = signal<AuthResponse | null>(this.getStoredUser());

  isLoggedIn = computed(() => !!this.currentUser());
  currentRole = computed(() => this.currentUser()?.role || null);
  currentUserName = computed(() => this.currentUser()?.fullName || 'User');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        this.saveSession(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): Role | null {
    return this.currentUser()?.role || null;
  }

  getDashboardRoute(role?: Role | null): string {
    const targetRole = role || this.getRole();
    switch (targetRole) {
      case 'USER':
        return '/user/dashboard';
      case 'EMPLOYEE':
        return '/employee/dashboard';
      case 'MANAGER':
        return '/manager/dashboard';
      default:
        return '/login';
    }
  }

  private saveSession(auth: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, auth.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(auth));
    this.currentUser.set(auth);
  }

  private getStoredUser(): AuthResponse | null {
    try {
      const data = localStorage.getItem(this.USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}
