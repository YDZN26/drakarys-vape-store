import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { StockStatus, getStockStatus } from '../../../core/models/stock-status.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: false,
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() productTap = new EventEmitter<number>();

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
    return this.product.imageUrl ?? 'assets/icon/favicon.png';
  }

  tap(): void {
    this.productTap.emit(this.product.id);
  }
}
