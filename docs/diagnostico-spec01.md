# Diagnóstico: Drakarys Vape Store — Spec 01 (Catalog)

> Fecha: 2026-06-30
> Rama: feature/01-catalog
> Autor: Claude Code (revisión sin modificaciones)

---

## 1. Estructura de archivos

### Lo que existe y coincide con el plan

Toda la estructura de carpetas y archivos contemplada en la Sección 3 del plan (`docs/plans/01-catalog.md`) **está creada**. Ningún archivo del plan falta en disco.

```
src/app/
├── core/
│   ├── supabase/supabase.service.ts              ✓
│   ├── models/
│   │   ├── category.model.ts                     ✓
│   │   ├── product.model.ts                      ✓
│   │   ├── product-variant.model.ts              ✓
│   │   ├── stock-status.model.ts                 ✓
│   │   ├── product-filters.model.ts              ✓ (shape diverge, ver §2-A)
│   │   ├── sort-option.model.ts                  ✓
│   │   └── store-settings.model.ts               ✓
│   ├── age-gate/
│   │   ├── age-verification.service.ts           ✓
│   │   ├── age.guard.ts                          ✓
│   │   └── age-verification-modal/               ✓
│   └── store-hours/
│       ├── store-hours.service.ts                ✓
│       └── store-closed-banner/                  ✓
└── catalog/
    ├── catalog.module.ts + catalog-routing.ts    ✓
    ├── catalog.page.(ts|html|scss)               ✓
    ├── services/{category,product,catalog-state} ✓
    └── components/{todos los 8 listados}         ✓
```

### Archivos ADICIONALES no contemplados en el plan

| Archivo | Problema |
|---|---|
| `src/app/core/models/catalog-item.model.ts` | Modelo con campos en español snake_case. NO está en el plan. Toda la capa de servicios y UI lo usa en vez de `Product`. |
| `src/app/core/core.module.ts` | Existe y declara `ProductCardComponent` aquí, cuando debería pertenecer al módulo catalog. |

---

## 2. Estado por fase

### Fase A — Supabase foundation: PARCIAL

- **Step 1** ✓ — `@supabase/supabase-js@^2.108.2` instalado.
- **Step 1** ⚠️ — `environment.ts` y `environment.prod.ts` tienen las **claves de producción reales hardcodeadas** (no placeholders). El plan dice "placeholder values; real keys via Netlify env vars later" — este riesgo de seguridad ya fue saltado.
- **Step 2** ✓ — `SupabaseService` existe exactamente como el plan lo describe.
- **Step 3** PARCIAL:
  - `product-filters.model.ts` diverge del plan: usa `categoryName?: string` en vez de `categoryId?`, y **faltan los campos** `type`, `flavors?: string[]`, `nicotineLevels?: number[]` que el plan especifica para los filtros de tipo/sabor/nicotina.
  - `product.model.ts` agrega `type: string` y `featured: boolean` que no están en el plan (addons no disruptivos).
  - Todos los demás modelos coinciden con el plan.

### Fase B — Age verification gate: PARCIAL

- **Step 4** ✗ — `AgeVerificationService` usa **`sessionStorage`** en vez de **`localStorage`** (el plan es explícito: "reads/writes a single localStorage key... popup shown once per device"). El test `age-verification.service.spec.ts` incluso tiene un caso `'does NOT use localStorage'` que confirma el comportamiento de sessionStorage — es una divergencia intencional pero contradice el spec.
- **Step 5** ✓ — `ageGuard` existe como `CanActivateFn`. Redirige a `'/'` cuando no verificado; `AppComponent` presenta el modal en la raíz. Funcional.
- **Step 6** ✓ — `AgeVerificationModalComponent` existe. En decline hace `window.location.href = 'https://www.google.com'` (la pregunta abierta del plan fue resuelta como redirect externo).
- **Step 7** ✓ — `AppComponent.ngOnInit()` presenta el modal si `!isVerified()`. El guard está aplicado en `CatalogRoutingModule`.

### Fase C — Store hours / closed banner: PARCIAL

- **Step 8** ✗ — `StoreHoursService` usa un `MOCK_STORE_SETTINGS` hardcodeado en vez de llamar a `SupabaseService`. La lógica de cálculo de horario está correcta, pero no se conecta a Supabase.
- **Step 9** ✓ — `StoreClosedBannerComponent` existe y funciona correctamente con el servicio.
- **Step 10** ✗ — **No existe ningún archivo SQL / migración** en el repositorio. Las tablas `store_settings`, `categories`, `products`, `product_variants` no están documentadas en el repo.

### Fase D — Catalog data services: PARCIAL

- **Step 11** ✗ — `CategoryService.getCategories()` devuelve `of(MOCK_CATEGORIES)`. No llama a Supabase. Paradójicamente, el test `category.service.spec.ts` **sí fue escrito para la versión Supabase** (mockea `client.from().select().order()`), por lo que el test fallaría con la implementación actual.
- **Step 12/13** ✗ — `ProductService` devuelve mock data usando `CatalogItem` (campos en español). Filtra localmente. El plan define query builders contra Supabase con `.ilike()`, `.in()`, `.eq()`, `.range()`. Falta toda la lógica real de Supabase. También faltan los filtros de `type`, `flavors`, `nicotineLevels` porque `ProductFilters` no los tiene.
- **Step 14** ✓ — `CatalogStateService` está bien implementado: `BehaviorSubject`s, debounce de 300ms, paginación, `loadNextPage()`. El diseño es correcto; solo opera sobre `CatalogItem` en vez de `Product`.

### Fase E — Routing & module scaffolding: COMPLETA

- Steps 15, 16 ✓ — `CatalogModule` lazy-loaded en `/catalog`, `AppRoutingModule` actualizado.
- **Step 17** PARCIAL — `HomePage` inyecta `ProductService.getProducts()` y navega a `/catalog`. Pero **no inyecta `CategoryService`** para mostrar categorías reales en la home (usa un `selectedCategory` string local con valor `'ALL'`). Tampoco muestra `featuredProducts` — muestra todos los productos filtrados por categoría seleccionada.

### Fase F — Presentational UI components: PARCIAL

- Steps 18, 19, 22, 24, 25 ✓ — `CategoryListComponent`, `SearchBarComponent`, `SortSelectorComponent`, `ProductGridComponent`, `EmptyStateComponent` existen.
- **Step 20** ✗ PARCIAL — `FilterPanelComponent` solo tiene **precio range** (`ion-range`). Faltan: tipo (single-select), sabor (multi-select), nicotina (multi-select). El plan especifica los 4 tipos de filtro.
- **Step 21** PARCIAL — `ActiveFilterChipsComponent` maneja chips para `categoryName`, `searchTerm` y precio. Le faltan chips para `type`, `flavors`, `nicotineLevels` (que tampoco existen en `ProductFilters`).
- **Step 23** ✗ — `ProductCardComponent` existe pero acepta `@Input() item: CatalogItem` (campos en español). El plan y el test esperan `@Input() product: Product` + `@Input() variants: ProductVariant[]` con lógica de stock basada en suma de variantes.

### Fase G — Page composition: PARCIAL

- **Step 26** ✓ en estructura — `CatalogPage` compone todos los componentes, lee/escribe por `CatalogStateService`, guard aplicado. La navegación a `['/product', productId]` apunta a una ruta inexistente (correctamente marcada como out-of-scope en el plan).
- Problema: `catalog.module.ts` importa `CoreModule` que **declara y exporta `ProductCardComponent`**. Esto hace que `ProductCardComponent` se cargue eagerly (como parte de `CoreModule`) en vez de ser parte del lazy-loaded `CatalogModule`.

### Fase H — Tests: PARCIAL (con inconsistencias críticas)

Existen archivos `.spec.ts` para: `CatalogStateService`, `CategoryService`, `ProductService`, `AgeVerificationService`, `StoreHoursService`, `ProductCardComponent`, `ActiveFilterChipsComponent`, `EmptyStateComponent`, `AgeVerificationModalComponent`.

**Inconsistencias que harían fallar los tests:**

| Test | Problema |
|---|---|
| `product-card.component.spec.ts` | Usa `@Input() product: Product` y `@Input() variants: ProductVariant[]`, pero el componente tiene `@Input() item: CatalogItem`. Los tests **no compilan** contra el componente real. |
| `catalog-state.service.spec.ts` | Mockea `ProductService` que devuelve `Product`, pero `CatalogStateService` trabaja con `CatalogItem`. Además usa `categoryId` (que no existe en `ProductFilters`). |
| `category.service.spec.ts` | Test escrito para Supabase (mockea `client.from().select().order()`), pero la implementación devuelve `of(MOCK_CATEGORIES)` sin tocar Supabase. |

### Fase I — Acceptance checklist: No iniciada

---

## 3. Supabase

| Pregunta | Respuesta |
|---|---|
| ¿Existe `SupabaseService`? | **Sí** — `core/supabase/supabase.service.ts`, correcto. |
| ¿Existen keys en `environment.ts`? | **Sí, pero son las claves de producción reales**, no placeholders. Están hardcodeadas en ambos archivos. |
| ¿Archivos SQL / migraciones? | **No existe ninguno** en el repo. Las tablas no están definidas en código. |
| ¿Mock data hardcodeada? | **Sí, en 3 archivos:** `CategoryService` (5 categorías), `ProductService` (12 productos `CatalogItem`), `StoreHoursService` (1 registro de horarios). |

---

## 4. Mock data actual

El mock data de productos vive en `catalog/services/product.service.ts` como `MOCK_PRODUCTS: CatalogItem[]`.

**Shape actual (`CatalogItem`):**

```ts
{
  producto_id: string,
  codigo_barras: string | null,
  producto_nombre: string,
  descripcion: string | null,
  precio: number,
  stock: number,
  imagen: string | null,
  categoria_nombre: string
}
```

**Shape que pide el plan (`Product` + `ProductVariant` separados):**

```ts
// Product:
{ id, categoryId, name, brand, description, basePrice, images: string[], status, createdAt }

// ProductVariant (para stock):
{ id, productId, flavor, nicotineMg, sizeMl, priceOverride, stock, sku }
```

Las diferencias son sustanciales:

- Nombres en español vs camelCase inglés
- `stock` es un campo directo en `CatalogItem` vs calculado desde `ProductVariant[]`
- `imagen: string | null` vs `images: string[]`
- `precio` vs `basePrice`
- `CatalogItem` no tiene `brand`, `status`, `type`, `featured`, `createdAt`
- `CatalogItem` no contempla variantes (flavor, nicotine, size)

La mock data también aplana variantes (un producto = un stock total), mientras el plan modela variantes como tabla separada.

---

## 5. Age gate y store hours

### Age gate

| | Detalle |
|---|---|
| **Implementación** | `sessionStorage` con clave `drakarys_age_verified` |
| **Plan** | `localStorage` (business rule: "popup shown once per device") |
| **Diferencia funcional** | Con sessionStorage, el age gate reaparece en cada nueva pestaña o sesión del navegador — viola la regla de negocio del spec. La discrepancia está ademas codificada en el test (`'does NOT use localStorage'`), lo que sugiere que fue una decisión consciente. **Necesita alinearse con el tech lead.** |

### Store hours

- La lógica de cálculo (horario, días, holiday_mode) es correcta.
- Falta conectar con Supabase — solo usa mock.

---

## 6. Conclusión

**Alineación general**: La estructura de archivos y el scaffolding están completos (100% de archivos creados). La lógica de routing, guards, state management y composición de página están bien diseñados. Sin embargo, el código presenta **una deuda técnica central que bloquea todo el siguiente paso**: la bifurcación entre dos modelos de datos incompatibles.

### El problema raíz

El código implementado construyó la UI completa sobre `CatalogItem` (Spanish snake_case), mientras que los modelos del plan (`Product`, `ProductFilters`, `ProductVariant`) existen como archivos pero **nadie los usa**. Los tests fueron escritos pensando en los modelos del plan, la implementación usa `CatalogItem`. Esto crea:

1. Tests que no compilan contra el código real
2. `ProductFilters` truncado (sin type/flavors/nicotineLevels)
3. `FilterPanelComponent` incompleto (solo precio)
4. Un modelo huérfano `catalog-item.model.ts` que no tiene equivalente en el plan ni en el schema de Supabase definitivo
5. `ProductCardComponent` declarado en `CoreModule` en lugar de `CatalogModule`

### Siguiente paso concreto a ejecutar

**Resolver la bifurcación de modelos** antes de escribir una sola línea de código de Supabase. Específicamente:

1. Decidir si `CatalogItem` se elimina a favor del `Product` del plan, o si `Product` se renombra para que coincida con el schema real de Supabase (que podría tener columnas en inglés).
2. Una vez decidido el modelo canónico, actualizar: `product.service.ts`, `catalog-state.service.ts`, `product-card.component.ts`, `product-grid.component.ts`, `catalog.page.ts`, `home.page.ts`.
3. Mover `ProductCardComponent` fuera de `CoreModule` a `CatalogModule`.
4. Completar `ProductFilters` con los campos faltantes y actualizar `FilterPanelComponent`.
5. Solo entonces tiene sentido reemplazar el mock data por queries reales a Supabase.

### Riesgos adicionales

- **Claves de Supabase en el repo**: Las claves reales (no placeholders) están en `environment.ts`. Si el repo es público o se comparte, esto expone el anon key. Deberían reemplazarse por placeholders y usar variables de entorno en CI/CD.
- **sessionStorage vs localStorage**: El age gate no cumple la regla de negocio del spec ("once per device"). Necesita decisión explícita del tech lead.
- **Sin migraciones SQL**: No hay ninguna evidencia de que las tablas existan en Supabase. Antes de conectar los servicios, hay que confirmar que el schema en Supabase real coincide con los modelos del plan.
