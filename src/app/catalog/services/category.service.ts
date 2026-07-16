import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Category } from '../../core/models/category.model';
import { SupabaseService } from '../../core/supabase/supabase.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private supabaseService: SupabaseService) {}

  getCategories(): Observable<Category[]> {
    return from(
      this.supabaseService.client
        .from('categoria')
        .select('categoria_id, nombre')
        .order('categoria_id')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(row => this.mapToCategory(row));
      }),
      catchError(error => {
        console.error('[CategoryService] Failed to load categories', error);
        return of([]);
      })
    );
  }

  private mapToCategory(row: { categoria_id: number; nombre: string }): Category {
    return {
      id: row.categoria_id,
      name: row.nombre,
    };
  }
}
