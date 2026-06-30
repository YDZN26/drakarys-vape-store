import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { CatalogItem } from '../core/models/catalog-item.model';
import { ProductService } from '../catalog/services/product.service';
import { SortOption } from '../core/models/sort-option.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  selectedCategory = 'ALL';
  private selectedCategory$ = new BehaviorSubject<string>('ALL');
  filteredProducts$!: Observable<CatalogItem[]>;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filteredProducts$ = this.selectedCategory$.pipe(
      switchMap(cat =>
        this.productService.getProducts(
          cat === 'ALL' ? {} : { categoryName: cat },
          SortOption.Relevance,
          0,
          20
        )
      )
    );
  }

  onCategoryChange(event: any): void {
    const val = event.detail.value as string;
    this.selectedCategory = val;
    this.selectedCategory$.next(val);
  }

  goToCategory(categoryName: string): void {
    this.router.navigate(['/catalog'], { queryParams: { categoryName } });
  }

  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }

  goToProduct(productId: string): void {
    this.router.navigate(['/product', productId]);
  }
}
