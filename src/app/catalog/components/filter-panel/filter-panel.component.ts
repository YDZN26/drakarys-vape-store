import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProductFilters } from '../../../core/models/product-filters.model';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
  standalone: false,
})
export class FilterPanelComponent implements OnInit {
  @Input() currentFilters: ProductFilters = {};

  priceRange = { lower: 0, upper: 1500 };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    if (
      this.currentFilters.minPrice !== undefined ||
      this.currentFilters.maxPrice !== undefined
    ) {
      this.priceRange = {
        lower: this.currentFilters.minPrice ?? 0,
        upper: this.currentFilters.maxPrice ?? 1500,
      };
    }
  }

  onPriceChange(event: CustomEvent): void {
    this.priceRange = event.detail.value;
  }

  apply(): void {
    const filters: ProductFilters = {};
    if (this.priceRange.lower > 0) filters.minPrice = this.priceRange.lower;
    if (this.priceRange.upper < 1500) filters.maxPrice = this.priceRange.upper;
    this.modalCtrl.dismiss(filters);
  }

  reset(): void {
    this.priceRange = { lower: 0, upper: 1500 };
  }

  close(): void {
    this.modalCtrl.dismiss(null);
  }
}
