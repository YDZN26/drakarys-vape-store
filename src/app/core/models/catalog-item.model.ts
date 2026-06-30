export interface CatalogItem {
  producto_id: string;
  codigo_barras: string | null;
  producto_nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  imagen: string | null;
  categoria_nombre: string;
}
