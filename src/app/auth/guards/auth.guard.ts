import { inject } from '@angular/core';
import {
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  UrlSegment,
} from '@angular/router';

import { Observable, tap } from 'rxjs';

import { AuthService } from '../services/auth.service';
export const canMatchGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
): boolean | Observable<boolean> => {
  return checkAuthStatus();
};

export const canActivateGuard: CanActivateFn = (route, state) => {
  return checkAuthStatus();
};

const checkAuthStatus = (): boolean | Observable<boolean> => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  return authService.checkAuthentication().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
      }
    })
  );
};
