export interface ProductVariant {
  id: string;
  productId: string;
  flavor: string;
  nicotineMg: number;
  sizeMl: number;
  priceOverride: number | null;
  stock: number;
  sku: string;
}
