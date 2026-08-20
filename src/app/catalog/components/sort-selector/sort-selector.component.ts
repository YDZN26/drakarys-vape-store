import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SortOption } from '../../../core/models/sort-option.model';

@Component({
  selector: 'app-sort-selector',
  templateUrl: './sort-selector.component.html',
  styleUrls: ['./sort-selector.component.scss'],
  standalone: false,
})
export class SortSelectorComponent {
  @Input() value: SortOption = SortOption.Relevance;
  @Output() sortChange = new EventEmitter<SortOption>();

  readonly options = [
    { value: SortOption.Relevance, label: 'sort.relevance' },
    { value: SortOption.PriceLowToHigh, label: 'sort.priceLowToHigh' },
    { value: SortOption.PriceHighToLow, label: 'sort.priceHighToLow' },
    { value: SortOption.Newest, label: 'sort.newest' },
  ];

  onChange(event: CustomEvent): void {
    this.sortChange.emit(event.detail.value as SortOption);
  }
}
