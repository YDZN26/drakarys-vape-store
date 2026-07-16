import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { StoreHoursService } from './store-hours.service';

// Mock settings: Mon–Sat 09:00–21:00, no holiday mode
const WEEKDAY_10_00 = new Date(2024, 0, 15, 10, 0); // Monday 10:00 (open)
const WEEKDAY_22_00 = new Date(2024, 0, 15, 22, 0); // Monday 22:00 (closed)
const SUNDAY_12_00  = new Date(2024, 0, 14, 12, 0); // Sunday  12:00 (closed day)

describe('StoreHoursService', () => {
  let service: StoreHoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [StoreHoursService] });
    service = TestBed.inject(StoreHoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('emits true during open hours on a weekday', async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(WEEKDAY_10_00);
    const open = await firstValueFrom(service.isOpen());
    expect(open).toBeTrue();
    jasmine.clock().uninstall();
  });

  it('emits false after closing time', async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(WEEKDAY_22_00);
    const open = await firstValueFrom(service.isOpen());
    expect(open).toBeFalse();
    jasmine.clock().uninstall();
  });

  it('emits false on a closed day (Sunday)', async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(SUNDAY_12_00);
    const open = await firstValueFrom(service.isOpen());
    expect(open).toBeFalse();
    jasmine.clock().uninstall();
  });

  it('getClosedMessage emits null when no custom message is set', async () => {
    const message = await firstValueFrom(service.getClosedMessage());
    expect(message).toBeNull();
  });
});
