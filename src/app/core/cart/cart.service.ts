import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

const CART_STORAGE_KEY = 'drakarys_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  readonly items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  readonly totalItemCount$: Observable<number> = this.items$.pipe(
    map(items => items.reduce((count, item) => count + item.quantity, 0))
  );

  readonly totalPrice$: Observable<number> = this.items$.pipe(
    map(items => items.reduce((total, item) => total + item.product.price * item.quantity, 0))
  );

  constructor(private readonly translateService: TranslateService) {}

  addItem(product: Product, quantity = 1): void {
    const items = this.itemsSubject.value;
    const existing = items.find(item => item.product.id === product.id);

    const updated = existing
      ? items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        )
      : [...items, { product, quantity: Math.min(quantity, product.stock) }];

    this.setItems(updated);
  }

  removeItem(productId: number): void {
    this.setItems(this.itemsSubject.value.filter(item => item.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const item = this.itemsSubject.value.find(i => i.product.id === productId);
    const cappedQuantity = item ? Math.min(quantity, item.product.stock) : quantity;

    this.setItems(
      this.itemsSubject.value.map(i =>
        i.product.id === productId ? { ...i, quantity: cappedQuantity } : i
      )
    );
  }

  clearCart(): void {
    this.setItems([]);
  }

  buildWhatsAppUrl(): string {
    const items = this.itemsSubject.value;
    const origin = window.location.origin;

    const blocks = items.map(item => {
      const url = `${origin}/product/${item.product.id}`;
      return [
        `*${item.product.name}*`,
        this.translateService.instant('cart.whatsappMessage.quantityLabel', { quantity: item.quantity }),
        this.translateService.instant('cart.whatsappMessage.priceLabel', {
          price: item.product.price.toFixed(2),
        }),
        this.translateService.instant('cart.whatsappMessage.urlLabel', { url }),
      ].join('\n');
    });

    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const message = [
      this.translateService.instant('cart.whatsappMessage.greeting'),
      '',
      blocks.join('\n\n'),
      '',
      this.translateService.instant('cart.whatsappMessage.totalLabel', { total: total.toFixed(2) }),
      '',
      this.translateService.instant('cart.whatsappMessage.thanks'),
    ].join('\n');

    return `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  private setItems(items: CartItem[]): void {
    this.itemsSubject.next(items);
    this.saveToStorage(items);
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }
}
