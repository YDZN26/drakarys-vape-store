import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Subscription,
  take,
} from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { CatalogItem } from '../../core/models/catalog-item.model';
import { ProductFilters } from '../../core/models/product-filters.model';
import { SortOption } from '../../core/models/sort-option.model';
import { ProductService } from './product.service';

const PAGE_SIZE = 20;

@Injectable()
export class CatalogStateService implements OnDestroy {
  private _filters = new BehaviorSubject<ProductFilters>({});
  private _sort = new BehaviorSubject<SortOption>(SortOption.Relevance);
  private _search = new BehaviorSubject<string>('');
  private _products = new BehaviorSubject<CatalogItem[]>([]);
  private _loading = new BehaviorSubject<boolean>(false);
  private _hasMore = new BehaviorSubject<boolean>(true);
  private _page = 0;

  readonly filters$ = this._filters.asObservable();
  readonly sort$ = this._sort.asObservable();
  readonly products$ = this._products.asObservable();
  readonly loading$ = this._loading.asObservable();
  readonly hasMore$ = this._hasMore.asObservable();

  private sub: Subscription;

  constructor(private productService: ProductService) {
    this.sub = combineLatest([
      this._filters,
      this._sort,
      this._search.pipe(debounceTime(300)),
    ])
      .pipe(
        tap(() => {
          this._page = 0;
          this._products.next([]);
          this._hasMore.next(true);
          this._loading.next(true);
        }),
        switchMap(([filters, sort, search]) =>
          this.productService.getProducts(
            { ...filters, searchTerm: search || undefined },
            sort,
            0,
            PAGE_SIZE
          )
        )
      )
      .subscribe({
        next: items => {
          this._loading.next(false);
          this._products.next(items);
          this._hasMore.next(items.length === PAGE_SIZE);
        },
        error: () => this._loading.next(false),
      });
  }

  setFilters(filters: Partial<ProductFilters>): void {
    this._filters.next({ ...this._filters.value, ...filters });
  }

  clearFilters(): void {
    this._filters.next({});
    this._search.next('');
  }

  removeFilter(key: keyof ProductFilters): void {
    const current = { ...this._filters.value };
    delete current[key];
    this._filters.next(current);
  }

  setSort(sort: SortOption): void {
    this._sort.next(sort);
  }

  setSearch(term: string): void {
    this._search.next(term);
  }

  get currentFilters(): ProductFilters {
    return this._filters.value;
  }

  get currentSort(): SortOption {
    return this._sort.value;
  }

  loadNextPage(): void {
    if (!this._hasMore.value || this._loading.value) return;

    this._page++;
    this._loading.next(true);

    const filters = {
      ...this._filters.value,
      searchTerm: this._search.value || undefined,
    };

    this.productService
      .getProducts(filters, this._sort.value, this._page, PAGE_SIZE)
      .pipe(take(1))
      .subscribe({
        next: more => {
          this._loading.next(false);
          this._products.next([...this._products.value, ...more]);
          this._hasMore.next(more.length === PAGE_SIZE);
        },
        error: () => this._loading.next(false),
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
