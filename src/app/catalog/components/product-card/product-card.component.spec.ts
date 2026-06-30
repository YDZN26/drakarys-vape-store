import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../../../core/models/product.model';
import { ProductVariant } from '../../../core/models/product-variant.model';
import { StockStatus } from '../../../core/models/stock-status.model';

const MOCK_PRODUCT: Product = {
  id: 'p1',
  categoryId: 'cat1',
  name: 'Test Vape',
  brand: 'BrandX',
  description: 'A test vape',
  basePrice: 25,
  images: ['https://example.com/img.jpg'],
  status: 'active',
  type: 'Disposable',
  featured: false,
  createdAt: '2024-01-01',
};

function makeVariant(stock: number): ProductVariant {
  return { id: 'v1', productId: 'p1', flavor: 'Mint', nicotineMg: 20, sizeMl: 2, priceOverride: null, stock, sku: 'SKU1' };
}

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductCardComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = MOCK_PRODUCT;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('shows Available status when stock is high', () => {
    component.variants = [makeVariant(10)];
    expect(component.stockStatus).toBe(StockStatus.Available);
    expect(component.stockBadgeColor).toBe('success');
  });

  it('shows LowStock when total stock is <= 5', () => {
    component.variants = [makeVariant(2), makeVariant(2)];
    expect(component.stockStatus).toBe(StockStatus.LowStock);
    expect(component.stockBadgeColor).toBe('warning');
  });

  it('shows OutOfStock when total stock is 0', () => {
    component.variants = [makeVariant(0)];
    expect(component.stockStatus).toBe(StockStatus.OutOfStock);
    expect(component.stockBadgeColor).toBe('danger');
  });

  it('defaults to Available when no variants provided', () => {
    component.variants = [];
    expect(component.stockStatus).toBe(StockStatus.Available);
  });

  it('emits productTap with product id on tap()', () => {
    spyOn(component.productTap, 'emit');
    component.tap();
    expect(component.productTap.emit).toHaveBeenCalledWith('p1');
  });

  it('falls back to default image when images array is empty', () => {
    component.product = { ...MOCK_PRODUCT, images: [] };
    expect(component.mainImage).toBe('assets/icon/favicon.png');
  });
});
