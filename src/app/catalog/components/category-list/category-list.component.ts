import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  standalone: false,
})
export class CategoryListComponent {
  @Input() categories: Category[] = [];
  @Input() activeCategoryId: number | null = null;
  @Output() categorySelect = new EventEmitter<number | null>();

  select(categoryId: number | null): void {
    this.categorySelect.emit(categoryId);
  }
}
