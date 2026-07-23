import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Category } from '../core/models/category.model';
import { Product } from '../core/models/product.model';
import { CategoryService } from '../catalog/services/category.service';
import { ProductService } from '../catalog/services/product.service';
import { SortOption } from '../core/models/sort-option.model';
import { CartService } from '../core/cart/cart.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  selectedCategory: number | 'ALL' = 'ALL';
  private selectedCategory$ = new BehaviorSubject<number | 'ALL'>('ALL');
  filteredProducts$!: Observable<Product[]>;
  categories$!: Observable<Category[]>;
  readonly cartItemCount$: Observable<number> = this.cartService.totalItemCount$;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();

    this.filteredProducts$ = this.selectedCategory$.pipe(
      switchMap(categoryId =>
        this.productService.getProducts(
          categoryId === 'ALL' ? {} : { categoryId },
          SortOption.Relevance,
          0,
          20
        )
      )
    );
  }

  get whatsappUrl(): string {
    return `https://wa.me/${environment.whatsappNumber}`;
  }

  get phoneHref(): string {
    return `tel:+${environment.whatsappNumber}`;
  }

  get formattedPhone(): string {
    const raw = environment.whatsappNumber;
    const countryCode = raw.slice(0, 3);
    const localGroups = raw.slice(3).match(/.{1,4}/g)?.join(' ') ?? raw.slice(3);
    return `+${countryCode} ${localGroups}`;
  }

  onCategoryChange(event: any): void {
    const val = event.detail.value as number | 'ALL';
    this.selectedCategory = val;
    this.selectedCategory$.next(val);
  }

  goToCategory(categoryId: number): void {
    this.router.navigate(['/catalog'], { queryParams: { categoryId } });
  }

  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }
}
