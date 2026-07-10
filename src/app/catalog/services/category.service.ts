import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Category } from '../../core/models/category.model';

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Desechables', slug: 'desechables', imageUrl: '' },
  { id: 2, name: 'Pods', slug: 'pods', imageUrl: '' },
  { id: 3, name: 'Mods', slug: 'mods', imageUrl: '' },
  { id: 4, name: 'Sales de Nicotina', slug: 'sales-de-nicotina', imageUrl: '' },
  { id: 5, name: 'Accesorios', slug: 'accesorios', imageUrl: '' },
];

@Injectable({ providedIn: 'root' })
export class CategoryService {
  getCategories(): Observable<Category[]> {
    return of(MOCK_CATEGORIES);
  }
}
