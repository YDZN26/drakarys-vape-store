import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
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

  addItem(product: Product, quantity = 1): void {
    const items = this.itemsSubject.value;
    const existing = items.find(item => item.product.id === product.id);

    const updated = existing
      ? items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...items, { product, quantity }];

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

    this.setItems(
      this.itemsSubject.value.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }

  clearCart(): void {
    this.setItems([]);
  }

  buildWhatsAppUrl(): string {
    const lines = this.itemsSubject.value.map(
      item => `${item.quantity}x ${item.product.name}`
    );
    const message = `Hola, quiero pedir:\n${lines.join('\n')}`;
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
