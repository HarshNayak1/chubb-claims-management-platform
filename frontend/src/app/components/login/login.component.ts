import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-card-container">
        <!-- Chubb Header Banner -->
        <div class="login-header">
          <div class="chubb-brand-badge">
            <span class="chubb-title">CHUBB</span>
            <span class="chubb-tagline">Claims Management System | APAC</span>
          </div>
          <p class="login-subtitle">Enterprise Insurance Claim Portal – Version 1.0 MVP</p>
        </div>

        <div class="login-body">
          <h2 class="form-heading">Sign In to Your Account</h2>
          <p class="form-instructions">Access user claimant, assessor employee, or managerial dashboards.</p>

          <!-- Error Alert -->
          <div *ngIf="errorMessage" class="alert alert-danger">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Login Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label" for="email">Work / Account Email</label>
              <input
                id="email"
                type="email"
                class="form-control"
                [class.is-invalid]="f['email'].touched && f['email'].invalid"
                formControlName="email"
                placeholder="e.g. user01@chubb.com"
                autocomplete="email"
              />
              <div *ngIf="f['email'].touched && f['email'].invalid" class="form-error">
                <span *ngIf="f['email'].errors?.['required']">Email address is required.</span>
                <span *ngIf="f['email'].errors?.['email']">Please enter a valid email format.</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input
                id="password"
                type="password"
                class="form-control"
                [class.is-invalid]="f['password'].touched && f['password'].invalid"
                formControlName="password"
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <div *ngIf="f['password'].touched && f['password'].invalid" class="form-error">
                Password is required.
              </div>
            </div>

            <button type="submit" [disabled]="loginForm.invalid || isLoading" class="btn btn-primary btn-block">
              <span *ngIf="!isLoading">Secure Sign In</span>
              <span *ngIf="isLoading">Authenticating...</span>
            </button>
          </form>

          <!-- Quick Test Accounts Helper -->
          <div class="demo-accounts-panel">
            <div class="demo-title">
              <span>⚡ Fast 1-Click Test Credentials</span>
            </div>
            <div class="demo-buttons">
              <button type="button" class="btn-demo demo-user" (click)="fillDemo('user01@chubb.com', 'User@123')">
                <span class="role-pill">USER</span>
                <span class="demo-text">user01&#64;chubb.com</span>
              </button>
              <button type="button" class="btn-demo demo-emp" (click)="fillDemo('employee01@chubb.com', 'Employee@123')">
                <span class="role-pill">EMPLOYEE</span>
                <span class="demo-text">employee01&#64;chubb.com</span>
              </button>
              <button type="button" class="btn-demo demo-mgr" (click)="fillDemo('manager01@chubb.com', 'Manager@123')">
                <span class="role-pill">MANAGER</span>
                <span class="demo-text">manager01&#64;chubb.com</span>
              </button>
            </div>
          </div>
        </div>

        <div class="login-footer">
          <span>&copy; 2026 Chubb APAC. Secure insurance claims portal. Confidential enterprise application.</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #001a2c 0%, #002B49 50%, #00406c 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .login-card-container {
      width: 100%;
      max-width: 480px;
      background: #ffffff;
      border-radius: var(--radius-lg);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .login-header {
      background: var(--chubb-navy);
      color: white;
      padding: 28px 32px 24px 32px;
      border-bottom: 4px solid var(--chubb-red);
    }

    .chubb-brand-badge {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 6px;
    }

    .chubb-title {
      font-size: 1.8rem;
      font-weight: 900;
      letter-spacing: 3px;
      color: #ffffff;
    }

    .chubb-tagline {
      font-size: 0.85rem;
      color: #94a3b8;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .login-subtitle {
      font-size: 0.86rem;
      color: #cbd5e1;
      margin-top: 4px;
    }

    .login-body {
      padding: 32px;
    }

    .form-heading {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--chubb-navy);
    }

    .form-instructions {
      font-size: 0.88rem;
      color: var(--chubb-text-muted);
      margin-top: 4px;
      margin-bottom: 24px;
    }

    .btn-block {
      width: 100%;
      padding: 12px;
      font-size: 1rem;
      margin-top: 8px;
    }

    .demo-accounts-panel {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px dashed var(--chubb-border);
    }

    .demo-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--chubb-navy);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .demo-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .btn-demo {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 8px 12px;
      background-color: #f8fafc;
      border: 1px solid var(--chubb-border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      text-align: left;
      transition: all 0.15s ease;
    }

    .btn-demo:hover {
      background-color: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateX(2px);
    }

    .role-pill {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }

    .demo-user .role-pill { background: #e0f2fe; color: #0369a1; }
    .demo-emp .role-pill { background: #fef3c7; color: #b45309; }
    .demo-mgr .role-pill { background: #fee2e2; color: #b91c1c; }

    .demo-text {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--chubb-navy);
    }

    .login-footer {
      background-color: #f8fafc;
      border-top: 1px solid var(--chubb-border);
      padding: 14px 24px;
      text-align: center;
      font-size: 0.72rem;
      color: var(--chubb-text-muted);
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  fillDemo(email: string, pass: string): void {
    this.loginForm.patchValue({
      email: email,
      password: pass
    });
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        const targetRoute = this.authService.getDashboardRoute(res.role);
        this.router.navigate([targetRoute]);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else {
          this.errorMessage = 'Failed to connect to backend server. Ensure backend is running.';
        }
      }
    });
  }
}
