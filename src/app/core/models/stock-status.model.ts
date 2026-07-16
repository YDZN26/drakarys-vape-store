export enum StockStatus {
  Available = 'available',
  LowStock = 'low_stock',
  OutOfStock = 'out_of_stock',
}

const LOW_STOCK_THRESHOLD = 5;

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return StockStatus.OutOfStock;
  if (stock <= LOW_STOCK_THRESHOLD) return StockStatus.LowStock;
  return StockStatus.Available;
}
