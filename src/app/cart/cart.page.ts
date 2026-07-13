import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartItem } from '../core/models/cart-item.model';
import { CartService } from '../core/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.page.html',
  styleUrls: ['cart.page.scss'],
  standalone: false,
})
export class CartPage {
  readonly items$: Observable<CartItem[]> = this.cartService.items$;
  readonly totalPrice$: Observable<number> = this.cartService.totalPrice$;

  constructor(
    private readonly cartService: CartService,
    private readonly router: Router
  ) {}

  increase(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decrease(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity - 1);
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  sendWhatsAppOrder(): void {
    window.open(this.cartService.buildWhatsAppUrl(), '_blank');
  }

  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }

  mainImage(item: CartItem): string {
    return item.product.imageUrl ?? 'assets/icon/favicon.png';
  }

  lineSubtotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }
}
