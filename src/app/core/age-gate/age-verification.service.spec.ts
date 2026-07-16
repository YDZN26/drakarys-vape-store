import { TestBed } from '@angular/core/testing';
import { AgeVerificationService } from './age-verification.service';

describe('AgeVerificationService', () => {
  let service: AgeVerificationService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgeVerificationService);
  });

  it('returns false when localStorage key is absent', () => {
    expect(service.isVerified()).toBeFalse();
  });

  it('returns true after confirmAge()', () => {
    service.confirmAge();
    expect(service.isVerified()).toBeTrue();
    expect(localStorage.getItem('drakarys_age_verified')).toBe('true');
  });

  it('returns false after declineAge()', () => {
    service.confirmAge();
    service.declineAge();
    expect(service.isVerified()).toBeFalse();
    expect(localStorage.getItem('drakarys_age_verified')).toBeNull();
  });

  it('persists across simulated new sessions (localStorage is not cleared between reloads)', () => {
    service.confirmAge();

    const reloadedService = new AgeVerificationService();
    expect(reloadedService.isVerified()).toBeTrue();
  });
});
