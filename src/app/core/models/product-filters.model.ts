export interface ProductFilters {
  categoryId?: number;
  searchTerm?: string;
  productType?: string;
  flavors?: string[];
  nicotineLevels?: number[];
  minPrice?: number;
  maxPrice?: number;
}
