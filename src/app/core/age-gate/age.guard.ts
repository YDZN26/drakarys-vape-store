import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AgeVerificationService } from './age-verification.service';

export const ageGuard: CanActivateFn = () => {
  const ageService = inject(AgeVerificationService);
  const router = inject(Router);

  if (ageService.isVerified()) {
    return true;
  }

  return router.createUrlTree(['/']);
};
