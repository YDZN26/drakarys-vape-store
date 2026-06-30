import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CatalogItem } from '../../../core/models/catalog-item.model';
import { StockStatus, getStockStatus } from '../../../core/models/stock-status.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: false,
})
export class ProductCardComponent {
  @Input() item!: CatalogItem;
  @Output() productTap = new EventEmitter<string>();

  get stockStatus(): StockStatus {
    return getStockStatus(this.item.stock);
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
    return this.item.imagen ?? 'assets/icon/favicon.png';
  }

  tap(): void {
    this.productTap.emit(this.item.producto_id);
  }
}
