import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { CatalogItem } from '../../core/models/catalog-item.model';
import { ProductFilters } from '../../core/models/product-filters.model';
import { SortOption } from '../../core/models/sort-option.model';

const MOCK_PRODUCTS: CatalogItem[] = [
  {
    producto_id: '1',
    codigo_barras: '7501000001',
    producto_nombre: 'Drag X Pro',
    descripcion: 'Pod mod de alto rendimiento con pantalla OLED y ajuste de potencia.',
    precio: 899,
    stock: 15,
    imagen: null,
    categoria_nombre: 'Mods',
  },
  {
    producto_id: '2',
    codigo_barras: '7501000002',
    producto_nombre: 'Vaporesso XROS 3',
    descripcion: 'Sistema pod compacto con relleno lateral y bobina de malla.',
    precio: 499,
    stock: 30,
    imagen: null,
    categoria_nombre: 'Pods',
  },
  {
    producto_id: '3',
    codigo_barras: '7501000003',
    producto_nombre: 'Elf Bar BC5000',
    descripcion: 'Desechable recargable de 5000 puffs, sabor mango helado.',
    precio: 249,
    stock: 50,
    imagen: null,
    categoria_nombre: 'Desechables',
  },
  {
    producto_id: '4',
    codigo_barras: '7501000004',
    producto_nombre: 'Lost Mary MO5000',
    descripcion: 'Desechable recargable 5000 puffs con pantalla de batería.',
    precio: 269,
    stock: 40,
    imagen: null,
    categoria_nombre: 'Desechables',
  },
  {
    producto_id: '5',
    codigo_barras: '7501000005',
    producto_nombre: 'Naked 100 Lava Flow',
    descripcion: 'Sal de nicotina 50mg, sabor piña coco fresa, 30ml.',
    precio: 189,
    stock: 60,
    imagen: null,
    categoria_nombre: 'Sales de Nicotina',
  },
  {
    producto_id: '6',
    codigo_barras: '7501000006',
    producto_nombre: 'Pachamama Mint Leaf',
    descripcion: 'Sal de nicotina menta fresca 25mg, 30ml.',
    precio: 179,
    stock: 45,
    imagen: null,
    categoria_nombre: 'Sales de Nicotina',
  },
  {
    producto_id: '7',
    codigo_barras: '7501000007',
    producto_nombre: 'GeekVape Aegis Legend 2',
    descripcion: 'Mod caja 200W, resistente al agua, polvo y golpes.',
    precio: 1299,
    stock: 8,
    imagen: null,
    categoria_nombre: 'Mods',
  },
  {
    producto_id: '8',
    codigo_barras: '7501000008',
    producto_nombre: 'Uwell Caliburn G3',
    descripcion: 'Pod de bolsillo 25W con pantalla OLED y bobina de malla.',
    precio: 549,
    stock: 22,
    imagen: null,
    categoria_nombre: 'Pods',
  },
  {
    producto_id: '9',
    codigo_barras: '7501000009',
    producto_nombre: 'Smok Nord 5',
    descripcion: 'Pod mod 80W con pantalla a color y bobinas intercambiables.',
    precio: 649,
    stock: 3,
    imagen: null,
    categoria_nombre: 'Pods',
  },
  {
    producto_id: '10',
    codigo_barras: '7501000010',
    producto_nombre: 'Coil Master 521 Tab Mini',
    descripcion: 'Estación de construcción y prueba de resistencias.',
    precio: 349,
    stock: 12,
    imagen: null,
    categoria_nombre: 'Accesorios',
  },
  {
    producto_id: '11',
    codigo_barras: '7501000011',
    producto_nombre: 'Cargador USB-C Doble Bahía',
    descripcion: 'Cargador externo para baterías 18650 y 21700, carga rápida.',
    precio: 229,
    stock: 0,
    imagen: null,
    categoria_nombre: 'Accesorios',
  },
  {
    producto_id: '12',
    codigo_barras: '7501000012',
    producto_nombre: 'Geek Bar Pulse 15000',
    descripcion: 'Desechable recargable modo pulse/regular, 15000 puffs.',
    precio: 319,
    stock: 35,
    imagen: null,
    categoria_nombre: 'Desechables',
  },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  getProducts(
    filters: ProductFilters,
    sort: SortOption,
    page: number,
    pageSize = 20
  ): Observable<CatalogItem[]> {
    let results = [...MOCK_PRODUCTS];

    if (filters.categoryName) {
      results = results.filter(p => p.categoria_nombre === filters.categoryName);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(p =>
        p.producto_nombre.toLowerCase().includes(term)
      );
    }
    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.precio >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.precio <= filters.maxPrice!);
    }

    switch (sort) {
      case SortOption.PriceLowToHigh:
        results.sort((a, b) => a.precio - b.precio);
        break;
      case SortOption.PriceHighToLow:
        results.sort((a, b) => b.precio - a.precio);
        break;
      case SortOption.Newest:
        results.sort((a, b) => Number(b.producto_id) - Number(a.producto_id));
        break;
      default:
        results.sort((a, b) =>
          a.producto_nombre.localeCompare(b.producto_nombre)
        );
    }

    const start = page * pageSize;
    return of(results.slice(start, start + pageSize));
  }

  getFeaturedProducts(): Observable<CatalogItem[]> {
    return of(MOCK_PRODUCTS.slice(0, 6));
  }
}
