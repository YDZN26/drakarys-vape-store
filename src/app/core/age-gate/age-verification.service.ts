import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AgeVerificationService {
  private readonly STORAGE_KEY = 'drakarys_age_verified';

  isVerified(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  confirmAge(): void {
    localStorage.setItem(this.STORAGE_KEY, 'true');
  }

  declineAge(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
