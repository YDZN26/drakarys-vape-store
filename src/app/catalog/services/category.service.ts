import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Category } from '../../core/models/category.model';

const MOCK_CATEGORIES: Category[] = [
  { id: 'Desechables', name: 'Desechables', slug: 'desechables', imageUrl: '' },
  { id: 'Pods', name: 'Pods', slug: 'pods', imageUrl: '' },
  { id: 'Mods', name: 'Mods', slug: 'mods', imageUrl: '' },
  { id: 'Sales de Nicotina', name: 'Sales de Nicotina', slug: 'sales-de-nicotina', imageUrl: '' },
  { id: 'Accesorios', name: 'Accesorios', slug: 'accesorios', imageUrl: '' },
];

@Injectable({ providedIn: 'root' })
export class CategoryService {
  getCategories(): Observable<Category[]> {
    return of(MOCK_CATEGORIES);
  }
}
