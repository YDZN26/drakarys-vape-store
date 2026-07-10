export interface Product {
  id: number;
  categoryId: number | null;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl: string | null;
  images: string[];
  flavor: string | null;
  nicotineMg: number | null;
  productType: string | null;
  featured: boolean;
}
