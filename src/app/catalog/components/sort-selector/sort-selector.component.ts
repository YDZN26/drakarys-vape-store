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
    { value: SortOption.Relevance, label: 'Relevance' },
    { value: SortOption.PriceLowToHigh, label: 'Price: Low to High' },
    { value: SortOption.PriceHighToLow, label: 'Price: High to Low' },
    { value: SortOption.Newest, label: 'Newest' },
  ];

  onChange(event: CustomEvent): void {
    this.sortChange.emit(event.detail.value as SortOption);
  }
}
