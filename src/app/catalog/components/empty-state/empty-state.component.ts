import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  standalone: false,
})
export class EmptyStateComponent {
  @Input() categories: Category[] = [];
  @Output() categorySelect = new EventEmitter<string>();
  @Output() clearFilters = new EventEmitter<void>();

  onCategorySelect(categoryId: string): void {
    this.categorySelect.emit(categoryId);
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }
}
