import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Product } from '../core/models/product.model';
import { ProductService } from '../catalog/services/product.service';
import { SortOption } from '../core/models/sort-option.model';

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

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
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

  goToProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }
}
