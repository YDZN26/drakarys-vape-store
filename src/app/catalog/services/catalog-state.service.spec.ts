import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { take, skip } from 'rxjs/operators';
import { CatalogStateService } from './catalog-state.service';
import { ProductService } from './product.service';
import { SortOption } from '../../core/models/sort-option.model';
import { Product } from '../../core/models/product.model';

const MOCK_PRODUCT: Partial<Product> = { id: 'p1', name: 'Test Vape' };

describe('CatalogStateService', () => {
  let service: CatalogStateService;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(() => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts', 'getFeaturedProducts']);
    productServiceSpy.getProducts.and.returnValue(of([MOCK_PRODUCT as Product]));

    TestBed.configureTestingModule({
      providers: [
        CatalogStateService,
        { provide: ProductService, useValue: productServiceSpy },
      ],
    });

    service = TestBed.inject(CatalogStateService);
  });

  it('fires initial product query on construction', fakeAsync(() => {
    tick(400);
    expect(productServiceSpy.getProducts).toHaveBeenCalledTimes(1);
  }));

  it('re-queries when sort changes', fakeAsync(() => {
    tick(400);
    service.setSort(SortOption.PriceLowToHigh);
    tick(400);
    expect(productServiceSpy.getProducts).toHaveBeenCalledTimes(2);
  }));

  it('debounces search input', fakeAsync(() => {
    tick(400);
    service.setSearch('a');
    service.setSearch('ab');
    service.setSearch('abc');
    tick(300);
    expect(productServiceSpy.getProducts).toHaveBeenCalledTimes(2);
  }));

  it('clearFilters resets filter state', fakeAsync(() => {
    tick(400);
    service.setFilters({ categoryId: 'cat1' });
    service.clearFilters();
    tick(400);
    expect(service.currentFilters).toEqual({});
  }));

  it('removeFilter deletes specific key', fakeAsync(() => {
    tick(400);
    service.setFilters({ categoryId: 'cat1', type: 'Disposable' });
    service.removeFilter('type');
    expect(service.currentFilters['type']).toBeUndefined();
    expect(service.currentFilters['categoryId']).toBe('cat1');
  }));
});
