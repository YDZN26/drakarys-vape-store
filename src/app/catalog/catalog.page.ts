import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { Observable, Subscription, filter, take } from 'rxjs';
import { Category } from '../core/models/category.model';
import { CatalogItem } from '../core/models/catalog-item.model';
import { ProductFilters } from '../core/models/product-filters.model';
import { SortOption } from '../core/models/sort-option.model';
import { CategoryService } from './services/category.service';
import { CatalogStateService } from './services/catalog-state.service';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
  standalone: false,
})
export class CatalogPage implements OnInit, OnDestroy {
  products$!: Observable<CatalogItem[]>;
  loading$!: Observable<boolean>;
  hasMore$!: Observable<boolean>;
  filters$!: Observable<ProductFilters>;
  sort$!: Observable<SortOption>;

  categories: Category[] = [];

  private subs = new Subscription();

  constructor(
    private catalogState: CatalogStateService,
    private categoryService: CategoryService,
    private modalCtrl: ModalController,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.products$ = this.catalogState.products$;
    this.loading$ = this.catalogState.loading$;
    this.hasMore$ = this.catalogState.hasMore$;
    this.filters$ = this.catalogState.filters$;
    this.sort$ = this.catalogState.sort$;

    this.subs.add(
      this.categoryService
        .getCategories()
        .subscribe(cats => (this.categories = cats))
    );

    this.subs.add(
      this.route.queryParams.subscribe(params => {
        if (params['categoryName']) {
          this.catalogState.setFilters({ categoryName: params['categoryName'] });
        }
      })
    );
  }

  get activeCategoryId(): string | null {
    return this.catalogState.currentFilters.categoryName ?? null;
  }

  get currentSort(): SortOption {
    return this.catalogState.currentSort;
  }

  onSearchChange(term: string): void {
    this.catalogState.setSearch(term);
  }

  onCategorySelect(categoryName: string | null): void {
    if (categoryName) {
      this.catalogState.setFilters({ categoryName });
    } else {
      this.catalogState.removeFilter('categoryName');
    }
  }

  onSortChange(sort: SortOption): void {
    this.catalogState.setSort(sort);
  }

  async openFilterPanel(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: FilterPanelComponent,
      componentProps: { currentFilters: this.catalogState.currentFilters },
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.75,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss<ProductFilters | null>();
    if (data) {
      this.catalogState.setFilters(data);
    }
  }

  onRemoveFilter(key: keyof ProductFilters): void {
    this.catalogState.removeFilter(key);
  }

  onClearFilters(): void {
    this.catalogState.clearFilters();
  }

  onProductTap(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  async onLoadMore(ev: InfiniteScrollCustomEvent): Promise<void> {
    this.catalogState.loadNextPage();
    this.catalogState.loading$.pipe(
      filter(loading => !loading),
      take(1)
    ).subscribe(() => ev.target.complete());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
