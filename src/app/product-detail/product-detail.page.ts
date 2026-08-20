import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Product } from '../core/models/product.model';
import { StockStatus, getStockStatus } from '../core/models/stock-status.model';
import { CartService } from '../core/cart/cart.service';
import { ProductService } from '../catalog/services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: false,
})
export class ProductDetailPage implements OnInit {
  product: Product | null = null;
  loading = true;
  quantity = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly toastCtrl: ToastController,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || Number.isNaN(id)) {
      this.loading = false;
      return;
    }

    this.productService.getProductById(id).subscribe(product => {
      this.product = product;
      this.quantity = 0;
      this.loading = false;
    });
  }

  increaseQuantity(): void {
    if (!this.product) return;
    this.quantity = Math.min(this.quantity + 1, this.product.stock);
  }

  decreaseQuantity(): void {
    this.quantity = Math.max(this.quantity - 1, 0);
  }

  onQuantityChange(rawValue: string): void {
    if (!this.product) return;
    const parsed = Number(rawValue);

    if (!Number.isFinite(parsed) || parsed < 0) {
      this.quantity = 0;
      return;
    }

    this.quantity = Math.min(Math.floor(parsed), this.product.stock);
  }

  get stockStatus(): StockStatus {
    return getStockStatus(this.product?.stock ?? 0);
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
    return this.product?.imageUrl ?? 'assets/icon/logo-head-master.png';
  }

  async addToCart(): Promise<void> {
    if (!this.product || this.stockStatus === StockStatus.OutOfStock) return;

    this.cartService.addItem(this.product, this.quantity);

    const toast = await this.toastCtrl.create({
      message: this.translateService.instant('product.addedToCartToast', { productName: this.product.name }),
      duration: 1500,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }

  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }
}
