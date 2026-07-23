import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Product } from '../../../core/models/product.model';
import { StockStatus, getStockStatus } from '../../../core/models/stock-status.model';
import { CartService } from '../../../core/cart/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: false,
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() productTap = new EventEmitter<number>();

  constructor(
    private readonly cartService: CartService,
    private readonly toastCtrl: ToastController
  ) {}

  get stockStatus(): StockStatus {
    return getStockStatus(this.product.stock);
  }

  get stockBadgeColor(): string {
    switch (this.stockStatus) {
      case StockStatus.OutOfStock: return 'danger';
      case StockStatus.LowStock:   return 'warning';
      default:                     return 'success';
    }
  }

  get stockBadgeLabel(): string {
    switch (this.stockStatus) {
      case StockStatus.OutOfStock: return 'Sin stock';
      case StockStatus.LowStock:   return 'Stock bajo';
      default:                     return 'En stock';
    }
  }

  get mainImage(): string {
    return this.product.imageUrl ?? 'assets/icon/logo-head-master.png';
  }

  tap(): void {
    this.productTap.emit(this.product.id);
  }

  async addToCart(event: Event): Promise<void> {
    event.stopPropagation();
    this.cartService.addItem(this.product, 1);

    const toast = await this.toastCtrl.create({
      message: `${this.product.name} agregado al carrito`,
      duration: 1500,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }
}
