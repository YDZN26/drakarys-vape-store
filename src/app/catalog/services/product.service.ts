import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Product } from '../../core/models/product.model';
import { ProductFilters } from '../../core/models/product-filters.model';
import { SortOption } from '../../core/models/sort-option.model';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    categoryId: 3,
    name: 'Drag X Pro',
    description: 'Pod mod de alto rendimiento con pantalla OLED y ajuste de potencia.',
    price: 899,
    stock: 15,
    isActive: true,
    imageUrl: null,
    images: [],
    flavor: null,
    nicotineMg: null,
    productType: 'mod',
    featured: true,
  },
  {
    id: 2,
    categoryId: 2,
    name: 'Vaporesso XROS 3',
    description: 'Sistema pod compacto con relleno lateral y bobina de malla.',
    price: 499,
    stock: 30,
    isActive: true,
    imageUrl: null,
    images: [],
    flavor: null,
    nicotineMg: null,
    productType: 'pod',
    featured: false,
  },
  {
    id: 3,
    categoryId: 1,
    name: 'Elf Bar BC5000',
    description: 'Desechable recargable de 5000 puffs, sabor mango helado.',
    price: 249,
    stock: 50,
    isActive: true,
    imageUrl: null,
    images: [],
    flavor: 'Mango Helado',
    nicotineMg: 50,
    productType: 'disposable',
    featured: true,
  },
  {
    id: 4,
    categoryId: 1,
    name: 'Lost Mary MO5000',
    description: 'Desechable recargable 5000 puffs con pantalla de batería.',
    price: 269,
    stock: 40,
    isActive: true,
    imageUrl: null,
    images: [],
    flavor: 'Sandía Hielo',
    nicotineMg: 50,
    productType: 'disposable',
    featured: false,
  },
  {
    id: 5,
    categoryId: 4,
    name: 'Naked 100 Lava Flow',
    description: 'Sal de nicotina 50mg, sabor piña coco fresa, 30ml.',
    price: 189,
    stock: 60,
    isActive: true,
    imageUrl: null,
    images: [],
    flavor: 'Piña Coco Fresa',
    nicotineMg: 50,
    productType: 'liquid',
    featured: false,
  },
  {
    id: 6,
    categoryId: 4,
    name: 'Pachamama Mint Leaf',
    description: 'Sal de nicotina menta fresca 25mg, 30ml.',
    price: 179,
    stock: 45,
    isActive: true,
    imageUrl: null,
    images: [],
    flavor: 'Menta Fresca',
    nicotineMg: 25,
    productType: 'liquid',
    featured: false,
  },
  {
    id: 7,
    categoryId: 3,
    name: 'GeekVape Aegis Legend 2',
    description: 'Mod caja 200W, resistente al agua, polvo y golpes.',
    price: 1299,
    stock: 8,
    isActive: true,
    imageUrl: null,
    images: [],
    flavor: null,
    nicotineMg: null,
    productType: 'mod',
    featured: true,
  },
  {
    id: 8,
    categoryId: 2,
    name: 'Uwell Caliburn G3',
    description: 'Pod de bolsillo 25W con pantalla OLED y bobina de malla.',
    price: 549,
    stock: 22,
    isActive: true,
    imageUrl: null,
    images: [],
    flavor: null,
    nicotineMg: null,
    productType: 'pod',
    featured: false,
  },
  {
    id: 9,
    categoryId: 2,
    name: 'Smok Nord 5',
    description: 'Pod mod 80W con pantalla a color y bobinas intercambiables.',
    price: 649,
    stock: 3,
    isActive: true,
    imageUrl: null,
    images: [],
    flavor: null,
    nicotineMg: null,
    productType: 'pod',
    featured: false,
  },
  {
    id: 10,
    categoryId: 5,
    name: 'Coil Master 521 Tab Mini',
    description: 'Estación de construcción y prueba de resistencias.',
    price: 349,
    stock: 12,
    isActive: true,
    imageUrl: null,
    images: [],
    flavor: null,
    nicotineMg: null,
    productType: 'accessory',
    featured: false,
  },
  {
    id: 11,
    categoryId: 5,
    name: 'Cargador USB-C Doble Bahía',
    description: 'Cargador externo para baterías 18650 y 21700, carga rápida.',
    price: 229,
    stock: 0,
    isActive: true,
    imageUrl: null,
    images: [],
    flavor: null,
    nicotineMg: null,
    productType: 'accessory',
    featured: false,
  },
  {
    id: 12,
    categoryId: 1,
    name: 'Geek Bar Pulse 15000',
    description: 'Desechable recargable modo pulse/regular, 15000 puffs.',
    price: 319,
    stock: 35,
    isActive: true,
    imageUrl: null,
    images: [],
    flavor: 'Sandía Kiwi',
    nicotineMg: 50,
    productType: 'disposable',
    featured: true,
  },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  getProducts(
    filters: ProductFilters,
    sort: SortOption,
    page: number,
    pageSize = 20
  ): Observable<Product[]> {
    let results = [...MOCK_PRODUCTS];

    if (filters.categoryId !== undefined) {
      results = results.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(p => p.name.toLowerCase().includes(term));
    }
    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice!);
    }

    switch (sort) {
      case SortOption.PriceLowToHigh:
        results.sort((a, b) => a.price - b.price);
        break;
      case SortOption.PriceHighToLow:
        results.sort((a, b) => b.price - a.price);
        break;
      case SortOption.Newest:
        results.sort((a, b) => b.id - a.id);
        break;
      default:
        results.sort((a, b) => a.name.localeCompare(b.name));
    }

    const start = page * pageSize;
    return of(results.slice(start, start + pageSize));
  }

  getFeaturedProducts(): Observable<Product[]> {
    return of(MOCK_PRODUCTS.slice(0, 6));
  }
}
