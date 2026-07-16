import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { StoreHoursService } from '../store-hours.service';

@Component({
  selector: 'app-store-closed-banner',
  templateUrl: './store-closed-banner.component.html',
  styleUrls: ['./store-closed-banner.component.scss'],
  standalone: false,
})
export class StoreClosedBannerComponent implements OnInit {
  show$!: Observable<boolean>;
  message$!: Observable<string>;

  constructor(private storeHours: StoreHoursService) {}

  ngOnInit(): void {
    this.show$ = this.storeHours.isOpen().pipe(map(open => !open));
    this.message$ = combineLatest([
      this.storeHours.isOpen(),
      this.storeHours.getClosedMessage(),
    ]).pipe(
      map(([, customMessage]) =>
        customMessage ?? 'We are currently closed. Come back during business hours.'
      )
    );
  }
}
