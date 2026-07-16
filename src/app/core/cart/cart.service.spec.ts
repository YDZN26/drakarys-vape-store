import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CartService } from './cart.service';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    categoryId: 1,
    name: 'Test Vape',
    description: null,
    price: 100,
    stock: 5,
    isActive: true,
    imageUrl: null,
    images: [],
    flavor: null,
    nicotineMg: null,
    productType: null,
    featured: false,
    ...overrides,
  };
}

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [CartService] });
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addItem', () => {
    it('caps the total quantity at product.stock across repeated adds', async () => {
      const product = makeProduct({ id: 1, stock: 5 });
      service.addItem(product, 3);
      service.addItem(product, 4);

      const items = await firstValueFrom(service.items$);
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(5);
    });

    it('does not cap the quantity when it stays within stock', async () => {
      const product = makeProduct({ id: 2, stock: 5 });
      service.addItem(product, 3);

      const items = await firstValueFrom(service.items$);
      expect(items[0].quantity).toBe(3);
    });
  });

  describe('updateQuantity', () => {
    it('caps the quantity at product.stock', async () => {
      const product = makeProduct({ id: 3, stock: 10 });
      service.addItem(product, 2);
      service.updateQuantity(3, 15);

      const items = await firstValueFrom(service.items$);
      expect(items[0].quantity).toBe(10);
    });

    it('removes the item when the quantity is 0 or less', async () => {
      const product = makeProduct({ id: 4, stock: 10 });
      service.addItem(product, 2);
      service.updateQuantity(4, 0);

      const items = await firstValueFrom(service.items$);
      expect(items.find(i => i.product.id === 4)).toBeUndefined();
    });
  });

  describe('buildWhatsAppUrl', () => {
    it('builds a wa.me URL with the cart contents encoded in the message', () => {
      const product = makeProduct({ id: 5, name: 'Elf Bar BC5000', stock: 10 });
      service.addItem(product, 2);

      const url = service.buildWhatsAppUrl();
      const expectedMessage = 'Hola, quiero pedir:\n2x Elf Bar BC5000';

      expect(url).toBe(
        `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(expectedMessage)}`
      );
    });
  });
});
