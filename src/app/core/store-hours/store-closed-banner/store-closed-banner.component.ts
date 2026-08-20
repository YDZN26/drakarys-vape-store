import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
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

  constructor(
    private storeHours: StoreHoursService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.show$ = this.storeHours.isOpen().pipe(map(open => !open));
    this.message$ = combineLatest([
      this.storeHours.isOpen(),
      this.storeHours.getClosedMessage(),
    ]).pipe(
      switchMap(([, customMessage]) =>
        customMessage ? of(customMessage) : this.translate.stream('storeClosedBanner.defaultMessage')
      )
    );
  }
}
