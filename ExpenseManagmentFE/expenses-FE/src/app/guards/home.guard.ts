import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const homeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authSrv = inject(AuthService);

  const isAuthenticated = authSrv.isLoggedIn();

  if (isAuthenticated) {
    console.log('User is authenticated, redirecting to dashboard');
    router.navigateByUrl('/dashboard');
    return false;
  } else {
    console.log('User is not authenticated, allowing access');
    return true;
  }
};
