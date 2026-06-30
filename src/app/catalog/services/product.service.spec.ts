import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ProductService } from './product.service';
import { SortOption } from '../../core/models/sort-option.model';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProducts returns all mock products when no filters applied', async () => {
    const products = await firstValueFrom(
      service.getProducts({}, SortOption.Relevance, 0)
    );
    expect(products.length).toBeGreaterThan(0);
  });

  it('getProducts filters by category name', async () => {
    const products = await firstValueFrom(
      service.getProducts({ categoryName: 'Desechables' }, SortOption.Relevance, 0)
    );
    expect(products.length).toBeGreaterThan(0);
    expect(products.every(p => p.categoria_nombre === 'Desechables')).toBeTrue();
  });

  it('getProducts filters by search term', async () => {
    const products = await firstValueFrom(
      service.getProducts({ searchTerm: 'elf' }, SortOption.Relevance, 0)
    );
    expect(products.length).toBeGreaterThan(0);
    expect(products[0].producto_nombre.toLowerCase()).toContain('elf');
  });

  it('getProducts sorts price low to high', async () => {
    const products = await firstValueFrom(
      service.getProducts({}, SortOption.PriceLowToHigh, 0)
    );
    for (let i = 1; i < products.length; i++) {
      expect(products[i].precio).toBeGreaterThanOrEqual(products[i - 1].precio);
    }
  });

  it('getFeaturedProducts returns first 6 products', async () => {
    const featured = await firstValueFrom(service.getFeaturedProducts());
    expect(featured.length).toBe(6);
  });
});
