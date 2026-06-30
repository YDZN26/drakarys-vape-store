import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AgeVerificationService {
  private readonly STORAGE_KEY = 'drakarys_age_verified';

  isVerified(): boolean {
    return sessionStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  confirmAge(): void {
    sessionStorage.setItem(this.STORAGE_KEY, 'true');
  }

  declineAge(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}
