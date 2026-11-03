import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const expectedRoles = route.data?.['roles'] as Role[] | undefined;
  if (expectedRoles && expectedRoles.length > 0) {
    const currentRole = authService.getRole();
    if (!currentRole || !expectedRoles.includes(currentRole)) {
      // Redirect to their respective authorized dashboard
      return router.createUrlTree([authService.getDashboardRoute(currentRole)]);
    }
  }

  return true;
};
