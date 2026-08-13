import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

import { ProductDetailPage } from './product-detail.page';
import { ProductService } from '../catalog/services/product.service';
import { CartService } from '../core/cart/cart.service';
import { Product } from '../core/models/product.model';
import { StockStatus } from '../core/models/stock-status.model';

const MOCK_PRODUCT: Product = {
  id: 1,
  categoryId: 1,
  name: 'Elf Bar BC5000',
  description: 'Desechable recargable',
  price: 249,
  stock: 10,
  isActive: true,
  imageUrl: null,
  images: [],
  flavor: 'Mango Helado',
  nicotineMg: 50,
  productType: 'disposable',
  featured: false,
};

describe('ProductDetailPage', () => {
  let component: ProductDetailPage;
  let fixture: ComponentFixture<ProductDetailPage>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  async function configure(product: Product | null, id = '1'): Promise<void> {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProductById']);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addItem']);
    productServiceSpy.getProductById.and.returnValue(of(product));

    await TestBed.configureTestingModule({
      declarations: [ProductDetailPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('creates the component', async () => {
    await configure(MOCK_PRODUCT);
    expect(component).toBeTruthy();
  });

  it('shows the product when getProductById returns one', async () => {
    await configure(MOCK_PRODUCT);

    expect(component.loading).toBeFalse();
    expect(component.product).toEqual(MOCK_PRODUCT);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.name')?.textContent).toContain('Elf Bar BC5000');
    expect(compiled.querySelector('.empty-state')).toBeNull();
  });

  it('shows "Producto no encontrado" when getProductById returns null', async () => {
    await configure(null);

    expect(component.loading).toBeFalse();
    expect(component.product).toBeNull();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state')?.textContent).toContain('Producto no encontrado');
    expect(compiled.querySelector('.product-detail')).toBeNull();
  });

  it('disables the "Agregar al carrito" button when stock is 0', async () => {
    await configure({ ...MOCK_PRODUCT, stock: 0 });

    expect(component.stockStatus).toBe(StockStatus.OutOfStock);

    const button: HTMLButtonElement | null =
      fixture.nativeElement.querySelector('.add-to-cart-btn');
    expect(button?.disabled).toBeTrue();
  });
});
