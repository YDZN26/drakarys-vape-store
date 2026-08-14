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
      const product = makeProduct({ id: 5, name: 'Elf Bar BC5000', price: 100, stock: 10 });
      service.addItem(product, 2);

      const url = service.buildWhatsAppUrl();
      const productUrl = `${window.location.origin}/product/5`;
      const expectedMessage = [
        'Hola, quiero comprar los siguientes artículos:',
        '',
        '*Elf Bar BC5000*',
        'Cantidad: 2',
        'Precio: Bs. 100.00',
        `URL: ${productUrl}`,
        '',
        'Precio Total: Bs. 200.00',
        '',
        'Gracias.',
      ].join('\n');

      expect(url).toBe(
        `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(expectedMessage)}`
      );
    });

    it('includes a blank-line-separated block per product and sums the grand total', () => {
      const productA = makeProduct({ id: 6, name: 'Elf Bar BC5000', price: 120.5, stock: 10 });
      const productB = makeProduct({ id: 7, name: 'Lost Mary OS5000', price: 99.99, stock: 10 });
      service.addItem(productA, 1);
      service.addItem(productB, 3);

      const url = service.buildWhatsAppUrl();
      const decoded = decodeURIComponent(url.split('?text=')[1]);

      expect(decoded).toContain('*Elf Bar BC5000*\nCantidad: 1\nPrecio: Bs. 120.50');
      expect(decoded).toContain(`URL: ${window.location.origin}/product/6`);
      expect(decoded).toContain('*Lost Mary OS5000*\nCantidad: 3\nPrecio: Bs. 99.99');
      expect(decoded).toContain(`URL: ${window.location.origin}/product/7`);
      expect(decoded).toContain('Precio Total: Bs. 420.47');
    });
  });
});
