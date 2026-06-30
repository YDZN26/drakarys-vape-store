import { TestBed } from '@angular/core/testing';
import { AgeVerificationService } from './age-verification.service';

describe('AgeVerificationService', () => {
  let service: AgeVerificationService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgeVerificationService);
  });

  it('returns false when sessionStorage key is absent', () => {
    expect(service.isVerified()).toBeFalse();
  });

  it('returns true after confirmAge()', () => {
    service.confirmAge();
    expect(service.isVerified()).toBeTrue();
    expect(sessionStorage.getItem('drakarys_age_verified')).toBe('true');
  });

  it('returns false after declineAge()', () => {
    service.confirmAge();
    service.declineAge();
    expect(service.isVerified()).toBeFalse();
    expect(sessionStorage.getItem('drakarys_age_verified')).toBeNull();
  });

  it('does NOT persist across simulated new sessions (sessionStorage cleared)', () => {
    service.confirmAge();
    sessionStorage.clear();
    expect(service.isVerified()).toBeFalse();
  });

  it('does NOT use localStorage', () => {
    service.confirmAge();
    expect(localStorage.getItem('drakarys_age_verified')).toBeNull();
  });
});
