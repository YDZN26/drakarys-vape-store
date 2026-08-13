import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../../core/models/product.model';
import { mapToProduct } from '../../core/models/product.mapper';
import { ProductFilters } from '../../core/models/product-filters.model';
import { SortOption } from '../../core/models/sort-option.model';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { FLAVOR_SYNONYMS } from '../../core/constants/flavor-synonyms';

const PRODUCT_COLUMNS =
  'producto_id, nombre, descripcion, precio, stock, estado, imagen, images, flavor, nicotine_mg, product_type, featured, categoria_id';

const FEATURED_LIMIT = 8;

// "10k" -> "10000". Product names always spell out the full number.
const NUMERIC_ABBREVIATION_PATTERN = /^(\d+)k$/i;

function expandNumericAbbreviation(word: string): string {
  const match = word.match(NUMERIC_ABBREVIATION_PATTERN);
  return match ? String(Number(match[1]) * 1000) : word;
}

function normalizeForSynonymLookup(word: string): string {
  return word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

// PostgREST's embedded filter syntax (used inside .or()) treats `,`, `.`,
// `:` and `()` as structural characters. Wrapping the value in double quotes
// preserves it as a literal, the same escaping @supabase/postgrest-js itself
// uses for .in()/.notIn() -- this also keeps user search input from being
// able to inject extra filter clauses.
function escapePostgrestLiteral(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

// Builds a PostgREST filter string equivalent to:
//   nombre ILIKE '%word1%' (OR its synonyms) AND nombre ILIKE '%word2%' (OR its synonyms) AND ...
// so that words can appear anywhere in the name, in any order, and each word
// (or any of its Spanish/English synonyms) satisfies its own AND-ed clause.
function buildNameSearchFilter(searchTerm: string): string | null {
  const words = searchTerm.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  const andGroups = words.map(rawWord => {
    const expanded = expandNumericAbbreviation(rawWord);
    const synonyms = FLAVOR_SYNONYMS[normalizeForSynonymLookup(expanded)] ?? [];
    const alternatives = [expanded, ...synonyms];

    const conditions = alternatives.map(
      alt => `nombre.ilike.${escapePostgrestLiteral(`%${alt}%`)}`
    );

    return conditions.length > 1 ? `or(${conditions.join(',')})` : conditions[0];
  });

  return `and(${andGroups.join(',')})`;
}

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
      const nameFilter = buildNameSearchFilter(filters.searchTerm);
      if (nameFilter) {
        query = query.or(nameFilter);
      }
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

  getProductById(id: number): Observable<Product | null> {
    return from(
      this.supabaseService.client
        .from('producto')
        .select(PRODUCT_COLUMNS)
        .eq('producto_id', id)
        .eq('estado', true)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) return null;
        return mapToProduct(data);
      }),
      catchError(error => {
        console.error('[ProductService] Failed to load product by id', error);
        return of(null);
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
