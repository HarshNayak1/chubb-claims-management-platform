import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { CreateClaimComponent } from './components/user/create-claim/create-claim.component';
import { MyClaimsComponent } from './components/user/my-claims/my-claims.component';
import { ClaimDetailsComponent } from './components/user/claim-details/claim-details.component';
import { EmployeeDashboardComponent } from './components/employee/employee-dashboard/employee-dashboard.component';
import { EmployeeClaimsComponent } from './components/employee/employee-claims/employee-claims.component';
import { EmployeeClaimDetailComponent } from './components/employee/employee-claim-detail/employee-claim-detail.component';
import { ManagerDashboardComponent } from './components/manager/manager-dashboard/manager-dashboard.component';
import { ManagerClaimsComponent } from './components/manager/manager-claims/manager-claims.component';
import { ManagerUsersComponent } from './components/manager/manager-users/manager-users.component';
import { ManagerEmployeesComponent } from './components/manager/manager-employees/manager-employees.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      // USER ROUTES
      {
        path: 'user/dashboard',
        component: UserDashboardComponent,
        data: { roles: ['USER'] }
      },
      {
        path: 'user/create-claim',
        component: CreateClaimComponent,
        data: { roles: ['USER'] }
      },
      {
        path: 'user/my-claims',
        component: MyClaimsComponent,
        data: { roles: ['USER'] }
      },
      {
        path: 'user/my-claims/:id',
        component: ClaimDetailsComponent,
        data: { roles: ['USER'] }
      },

      // EMPLOYEE ROUTES
      {
        path: 'employee/dashboard',
        component: EmployeeDashboardComponent,
        data: { roles: ['EMPLOYEE'] }
      },
      {
        path: 'employee/claims',
        component: EmployeeClaimsComponent,
        data: { roles: ['EMPLOYEE'] }
      },
      {
        path: 'employee/claims/:id',
        component: EmployeeClaimDetailComponent,
        data: { roles: ['EMPLOYEE'] }
      },

      // MANAGER ROUTES
      {
        path: 'manager/dashboard',
        component: ManagerDashboardComponent,
        data: { roles: ['MANAGER'] }
      },
      {
        path: 'manager/claims',
        component: ManagerClaimsComponent,
        data: { roles: ['MANAGER'] }
      },
      {
        path: 'manager/users',
        component: ManagerUsersComponent,
        data: { roles: ['MANAGER'] }
      },
      {
        path: 'manager/employees',
        component: ManagerEmployeesComponent,
        data: { roles: ['MANAGER'] }
      },

      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
