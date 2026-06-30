export interface Product {
  id: string;
  categoryId: string;
  name: string;
  brand: string;
  description: string;
  basePrice: number;
  images: string[];
  status: 'active' | 'inactive';
  type: string;
  featured: boolean;
  createdAt: string;
}
