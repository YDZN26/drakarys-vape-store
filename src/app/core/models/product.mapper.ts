import { Product } from './product.model';

export function mapToProduct(row: any): Product {
  return {
    id: row.producto_id,
    categoryId: row.categoria_id ?? null,
    name: row.nombre,
    description: row.descripcion ?? null,
    price: row.precio,
    stock: row.stock,
    isActive: row.estado !== 'inactive',
    imageUrl: row.imagen ?? null,
    images: row.images ?? [],
    flavor: row.flavor ?? null,
    nicotineMg: row.nicotine_mg ?? null,
    productType: row.product_type ?? null,
    featured: row.featured ?? false,
  };
}
