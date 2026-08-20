import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
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
    private readonly toastCtrl: ToastController,
    private readonly translateService: TranslateService
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
      case StockStatus.OutOfStock: return this.translateService.instant('product.stockBadge.outOfStock');
      case StockStatus.LowStock:   return this.translateService.instant('product.stockBadge.lowStock');
      default:                     return this.translateService.instant('product.stockBadge.inStock');
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
      message: this.translateService.instant('product.addedToCartToast', { productName: this.product.name }),
      duration: 1500,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }
}
