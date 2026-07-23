import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../../../core/models/product.model';
import { StockStatus } from '../../../core/models/stock-status.model';

const MOCK_PRODUCT: Product = {
  id: 1,
  categoryId: 1,
  name: 'Test Vape',
  description: 'A test vape',
  price: 25,
  stock: 10,
  isActive: true,
  imageUrl: 'https://example.com/img.jpg',
  images: [],
  flavor: 'Mint',
  nicotineMg: 20,
  productType: 'disposable',
  featured: false,
};

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
    component.product = { ...MOCK_PRODUCT, stock: 10 };
    expect(component.stockStatus).toBe(StockStatus.Available);
    expect(component.stockBadgeColor).toBe('success');
  });

  it('shows LowStock when stock is at or below the threshold', () => {
    component.product = { ...MOCK_PRODUCT, stock: 4 };
    expect(component.stockStatus).toBe(StockStatus.LowStock);
    expect(component.stockBadgeColor).toBe('warning');
  });

  it('shows OutOfStock when stock is 0', () => {
    component.product = { ...MOCK_PRODUCT, stock: 0 };
    expect(component.stockStatus).toBe(StockStatus.OutOfStock);
    expect(component.stockBadgeColor).toBe('danger');
  });

  it('emits productTap with product id on tap()', () => {
    spyOn(component.productTap, 'emit');
    component.tap();
    expect(component.productTap.emit).toHaveBeenCalledWith(1);
  });

  it('falls back to default image when imageUrl is null', () => {
    component.product = { ...MOCK_PRODUCT, imageUrl: null };
    expect(component.mainImage).toBe('assets/icon/logo-head-master.png');
  });
});
