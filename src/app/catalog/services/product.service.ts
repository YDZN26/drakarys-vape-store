import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../../core/models/product.model';
import { mapToProduct } from '../../core/models/product.mapper';
import { ProductFilters } from '../../core/models/product-filters.model';
import { SortOption } from '../../core/models/sort-option.model';
import { SupabaseService } from '../../core/supabase/supabase.service';

const PRODUCT_COLUMNS =
  'producto_id, nombre, descripcion, precio, stock, estado, imagen, images, flavor, nicotine_mg, product_type, featured, categoria_id';

const FEATURED_LIMIT = 8;

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private supabaseService: SupabaseService) {}

  getProducts(
    filters: ProductFilters,
    sort: SortOption,
    page: number,
    pageSize = 20
  ): Observable<Product[]> {
    let query = this.supabaseService.client.from('producto').select(PRODUCT_COLUMNS);

    if (filters.categoryId !== undefined) {
      query = query.eq('categoria_id', filters.categoryId);
    }
    if (filters.searchTerm) {
      query = query.ilike('nombre', `%${filters.searchTerm}%`);
    }
    if (filters.minPrice !== undefined) {
      query = query.gte('precio', filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte('precio', filters.maxPrice);
    }

    query = this.applySort(query, sort);

    const start = page * pageSize;
    query = query.range(start, start + pageSize - 1);

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        // Second layer of defense: never trust RLS silently, filter estado
        // client-side too even though anon SELECT is already scoped to it.
        return (data ?? []).map(row => mapToProduct(row)).filter(product => product.isActive);
      }),
      catchError(error => {
        console.error('[ProductService] Failed to load products', error);
        return of([]);
      })
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return from(
      this.supabaseService.client
        .from('producto')
        .select(PRODUCT_COLUMNS)
        .eq('featured', true)
        .limit(FEATURED_LIMIT)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(row => mapToProduct(row)).filter(product => product.isActive);
      }),
      catchError(error => {
        console.error('[ProductService] Failed to load featured products', error);
        return of([]);
      })
    );
  }

  private applySort(query: any, sort: SortOption): any {
    switch (sort) {
      case SortOption.PriceLowToHigh:
        return query.order('precio', { ascending: true });
      case SortOption.PriceHighToLow:
        return query.order('precio', { ascending: false });
      case SortOption.Newest:
        return query.order('producto_id', { ascending: false });
      default:
        return query.order('nombre', { ascending: true });
    }
  }
}
