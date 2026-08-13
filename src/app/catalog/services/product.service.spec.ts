import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ProductService } from './product.service';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { SortOption } from '../../core/models/sort-option.model';

// Raw rows as Supabase actually returns them for PRODUCT_COLUMNS
function makeRow(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    producto_id: 1,
    nombre: 'Elf Bar BC5000',
    descripcion: 'Desechable recargable',
    precio: 249,
    stock: 50,
    estado: true,
    imagen: null,
    images: [],
    flavor: 'Mango Helado',
    nicotine_mg: 50,
    product_type: 'disposable',
    featured: true,
    categoria_id: 1,
    ...overrides,
  };
}

// Chainable query builder mock matching the real Supabase-js builder shape:
// every filter/order method returns itself, and the terminal call
// (range()/limit()/single()) resolves like a promise, since ProductService
// passes the query straight into rxjs `from(...)`.
function createQueryBuilder(response: { data: any; error: any }) {
  const builder: any = {};
  ['select', 'eq', 'ilike', 'or', 'gte', 'lte', 'order'].forEach(method => {
    builder[method] = jasmine.createSpy(method).and.returnValue(builder);
  });
  builder.range = jasmine.createSpy('range').and.returnValue(Promise.resolve(response));
  builder.limit = jasmine.createSpy('limit').and.returnValue(Promise.resolve(response));
  builder.single = jasmine.createSpy('single').and.returnValue(Promise.resolve(response));
  return builder;
}

// this.supabaseService.client.from(...) -- SupabaseService exposes the real
// Supabase client under a `.client` property, so the mock must nest the
// query builder one level deeper than the builder itself.
function createMockClient(response: { data: any; error: any }) {
  const builder = createQueryBuilder(response);
  const supabaseClient = { from: jasmine.createSpy('from').and.returnValue(builder) };
  return { supabaseClient, builder };
}

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    const { supabaseClient } = createMockClient({ data: [], error: null });

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: SupabaseService, useValue: { client: supabaseClient } },
      ],
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProducts returns mapped products when no filters applied', async () => {
    const { supabaseClient } = createMockClient({
      data: [makeRow({ producto_id: 1 }), makeRow({ producto_id: 2, nombre: 'Vaporesso XROS 3' })],
      error: null,
    });
    const scopedService = new ProductService({ client: supabaseClient } as any);

    const products = await firstValueFrom(scopedService.getProducts({}, SortOption.Relevance, 0));

    expect(products.length).toBe(2);
    expect(products[0]).toEqual(
      jasmine.objectContaining({ id: 1, name: 'Elf Bar BC5000', price: 249, categoryId: 1 })
    );
  });

  it('getProducts filters by category', async () => {
    const { supabaseClient, builder } = createMockClient({
      data: [makeRow({ categoria_id: 1 })],
      error: null,
    });
    const scopedService = new ProductService({ client: supabaseClient } as any);

    const products = await firstValueFrom(
      scopedService.getProducts({ categoryId: 1 }, SortOption.Relevance, 0)
    );

    expect(builder.eq).toHaveBeenCalledWith('categoria_id', 1);
    expect(products.every(p => p.categoryId === 1)).toBeTrue();
  });

  it('getProducts combines category and search term with AND, not either/or', async () => {
    const { supabaseClient, builder } = createMockClient({
      data: [makeRow({ categoria_id: 1, nombre: 'Elf Bar BC5000' })],
      error: null,
    });
    const scopedService = new ProductService({ client: supabaseClient } as any);

    const products = await firstValueFrom(
      scopedService.getProducts({ categoryId: 1, searchTerm: 'elf' }, SortOption.Relevance, 0)
    );

    // .eq() and .or() are both called on the same query chain -- PostgREST
    // ANDs distinct top-level filter params by default, so this expresses
    // categoria_id = 1 AND nombre matches, never just one of the two.
    expect(builder.eq).toHaveBeenCalledWith('categoria_id', 1);
    expect(builder.or).toHaveBeenCalledWith('and(nombre.ilike."%elf%")');
    expect(products.every(p => p.categoryId === 1)).toBeTrue();
    expect(products[0].name.toLowerCase()).toContain('elf');
  });

  it('getProducts filters by search term', async () => {
    const { supabaseClient, builder } = createMockClient({
      data: [makeRow({ nombre: 'Elf Bar BC5000' })],
      error: null,
    });
    const scopedService = new ProductService({ client: supabaseClient } as any);

    const products = await firstValueFrom(
      scopedService.getProducts({ searchTerm: 'elf' }, SortOption.Relevance, 0)
    );

    expect(builder.or).toHaveBeenCalledWith('and(nombre.ilike."%elf%")');
    expect(products[0].name.toLowerCase()).toContain('elf');
  });

  it('getProducts matches words appearing anywhere in the name, in any order', async () => {
    // Real product: "Cartucho Life Pod Eco II 10000 Puffs (Watermelon Ice)".
    // "life" and "10000" are not adjacent -- "Pod Eco II" sits between them.
    const { supabaseClient, builder } = createMockClient({
      data: [makeRow({ nombre: 'Cartucho Life Pod Eco II 10000 Puffs (Watermelon Ice)' })],
      error: null,
    });
    const scopedService = new ProductService({ client: supabaseClient } as any);

    const products = await firstValueFrom(
      scopedService.getProducts({ searchTerm: 'life 10000' }, SortOption.Relevance, 0)
    );

    expect(builder.or).toHaveBeenCalledWith(
      'and(nombre.ilike."%life%",nombre.ilike."%10000%")'
    );
    expect(products.length).toBe(1);
  });

  it('getProducts expands "10k" style abbreviations to the full number', async () => {
    const { supabaseClient, builder } = createMockClient({
      data: [makeRow({ nombre: 'Cartucho Waka Creator 10000 Puffs (Sandia)' })],
      error: null,
    });
    const scopedService = new ProductService({ client: supabaseClient } as any);

    await firstValueFrom(scopedService.getProducts({ searchTerm: '10k' }, SortOption.Relevance, 0));

    expect(builder.or).toHaveBeenCalledWith('and(nombre.ilike."%10000%")');
  });

  it('getProducts includes the English synonym when searching a Spanish flavor', async () => {
    const { supabaseClient, builder } = createMockClient({
      data: [makeRow({ nombre: 'Blunt Wrap 4X (Strawberry)' })],
      error: null,
    });
    const scopedService = new ProductService({ client: supabaseClient } as any);

    await firstValueFrom(scopedService.getProducts({ searchTerm: 'fresa' }, SortOption.Relevance, 0));

    expect(builder.or).toHaveBeenCalledWith(
      'and(or(nombre.ilike."%fresa%",nombre.ilike."%strawberry%"))'
    );
  });

  it('getProducts includes the English synonym when searching a Spanish color', async () => {
    const { supabaseClient, builder } = createMockClient({
      data: [makeRow({ nombre: 'Caliburn KOKO Prime Pod System (Black)' })],
      error: null,
    });
    const scopedService = new ProductService({ client: supabaseClient } as any);

    await firstValueFrom(scopedService.getProducts({ searchTerm: 'negro' }, SortOption.Relevance, 0));

    expect(builder.or).toHaveBeenCalledWith(
      'and(or(nombre.ilike."%negro%",nombre.ilike."%black%"))'
    );
  });

  it('getProducts sorts price low to high', async () => {
    const { supabaseClient, builder } = createMockClient({
      data: [makeRow({ producto_id: 1, precio: 179 }), makeRow({ producto_id: 2, precio: 249 })],
      error: null,
    });
    const scopedService = new ProductService({ client: supabaseClient } as any);

    const products = await firstValueFrom(
      scopedService.getProducts({}, SortOption.PriceLowToHigh, 0)
    );

    expect(builder.order).toHaveBeenCalledWith('precio', { ascending: true });
    for (let i = 1; i < products.length; i++) {
      expect(products[i].price).toBeGreaterThanOrEqual(products[i - 1].price);
    }
  });

  it('getProducts filters out inactive products client-side', async () => {
    const { supabaseClient } = createMockClient({
      data: [makeRow({ producto_id: 1, estado: true }), makeRow({ producto_id: 2, estado: false })],
      error: null,
    });
    const scopedService = new ProductService({ client: supabaseClient } as any);

    const products = await firstValueFrom(scopedService.getProducts({}, SortOption.Relevance, 0));

    expect(products.length).toBe(1);
    expect(products[0].id).toBe(1);
  });

  it('getFeaturedProducts returns 8 featured products', async () => {
    const rows = Array.from({ length: 8 }, (_, i) => makeRow({ producto_id: i + 1 }));
    const { supabaseClient, builder } = createMockClient({ data: rows, error: null });
    const scopedService = new ProductService({ client: supabaseClient } as any);

    const featured = await firstValueFrom(scopedService.getFeaturedProducts());

    expect(builder.eq).toHaveBeenCalledWith('featured', true);
    expect(builder.limit).toHaveBeenCalledWith(8);
    expect(featured.length).toBe(8);
  });

  it('getProductById returns the mapped product when it exists and is active', async () => {
    const { supabaseClient, builder } = createMockClient({
      data: makeRow({ producto_id: 5, nombre: 'Vaporesso XROS 3' }),
      error: null,
    });
    const scopedService = new ProductService({ client: supabaseClient } as any);

    const product = await firstValueFrom(scopedService.getProductById(5));

    expect(builder.eq).toHaveBeenCalledWith('producto_id', 5);
    expect(builder.eq).toHaveBeenCalledWith('estado', true);
    expect(product).toEqual(
      jasmine.objectContaining({ id: 5, name: 'Vaporesso XROS 3' })
    );
  });

  it('getProductById returns null when the product does not exist or is inactive', async () => {
    const { supabaseClient } = createMockClient({
      data: null,
      error: { code: 'PGRST116', message: 'No rows found' },
    });
    const scopedService = new ProductService({ client: supabaseClient } as any);

    const product = await firstValueFrom(scopedService.getProductById(999));

    expect(product).toBeNull();
  });
});
