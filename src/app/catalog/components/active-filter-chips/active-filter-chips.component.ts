import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductFilters } from '../../../core/models/product-filters.model';

export interface ActiveFilter {
  key: keyof ProductFilters;
  label: string;
}

@Component({
  selector: 'app-active-filter-chips',
  templateUrl: './active-filter-chips.component.html',
  styleUrls: ['./active-filter-chips.component.scss'],
  standalone: false,
})
export class ActiveFilterChipsComponent {
  @Input() set filters(value: ProductFilters) {
    this._filters = value;
    this.activeFilters = this.buildActiveFilters(value);
  }
  @Output() removeFilter = new EventEmitter<keyof ProductFilters>();
  @Output() clearAll = new EventEmitter<void>();

  _filters: ProductFilters = {};
  activeFilters: ActiveFilter[] = [];

  get hasFilters(): boolean {
    return this.activeFilters.length > 0;
  }

  private buildActiveFilters(filters: ProductFilters): ActiveFilter[] {
    const result: ActiveFilter[] = [];

    if (filters.categoryName) {
      result.push({ key: 'categoryName', label: filters.categoryName });
    }
    if (filters.searchTerm) {
      result.push({ key: 'searchTerm', label: `"${filters.searchTerm}"` });
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const min = filters.minPrice ?? 0;
      const max = filters.maxPrice ?? '∞';
      result.push({ key: 'minPrice', label: `$${min}–$${max}` });
    }

    return result;
  }

  remove(key: keyof ProductFilters): void {
    if (key === 'minPrice' || key === 'maxPrice') {
      this.removeFilter.emit('minPrice');
      this.removeFilter.emit('maxPrice');
    } else {
      this.removeFilter.emit(key);
    }
  }

  clear(): void {
    this.clearAll.emit();
  }
}
