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
  @Input() activeCategoryId: string | null = null;
  @Output() categorySelect = new EventEmitter<string | null>();

  select(categoryId: string | null): void {
    this.categorySelect.emit(categoryId);
  }
}
