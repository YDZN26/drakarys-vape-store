import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, map } from 'rxjs';
import { StoreSettings } from '../models/store-settings.model';

const MOCK_STORE_SETTINGS: StoreSettings = {
  id: 1,
  holiday_mode: false,
  days_open: [1, 2, 3, 4, 5, 6],
  opens_at: '09:00',
  closes_at: '21:00',
  closed_message: null,
};

@Injectable({ providedIn: 'root' })
export class StoreHoursService {
  private settings$ = new ReplaySubject<StoreSettings>(1);

  constructor() {
    this.settings$.next(MOCK_STORE_SETTINGS);
  }

  isOpen(): Observable<boolean> {
    return this.settings$.pipe(
      map(settings => {
        if (settings.holiday_mode) return false;

        const now = new Date();
        const dayOfWeek = now.getDay();
        if (!settings.days_open.includes(dayOfWeek)) return false;

        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const [openH, openM] = settings.opens_at.split(':').map(Number);
        const [closeH, closeM] = settings.closes_at.split(':').map(Number);
        const openMinutes = openH * 60 + openM;
        const closeMinutes = closeH * 60 + closeM;

        return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
      })
    );
  }

  getClosedMessage(): Observable<string | null> {
    return this.settings$.pipe(map(s => s.closed_message));
  }
}
