import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
  standalone: false,
})
export class ProductGridComponent {
  @Input() products: Product[] = [];
  @Input() hasMore = false;
  @Input() loading = false;
  @Output() loadMore = new EventEmitter<InfiniteScrollCustomEvent>();
  @Output() productTap = new EventEmitter<number>();

  get resultCount(): number {
    return this.products.length;
  }

  onInfiniteScroll(ev: InfiniteScrollCustomEvent): void {
    this.loadMore.emit(ev);
  }

  onProductTap(productId: number): void {
    this.productTap.emit(productId);
  }
}
