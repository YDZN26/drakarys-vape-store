import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'catalog',
    loadChildren: () =>
      import('./catalog/catalog.module').then(m => m.CatalogModule),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./cart/cart.module').then(m => m.CartModule),
  },
  {
    path: 'product/:id',
    loadChildren: () =>
      import('./product-detail/product-detail.module').then(m => m.ProductDetailModule),
  },
  {
    path: 'guias/primer-vape',
    loadChildren: () =>
      import('./guia-primer-vape/guia-primer-vape.module').then(m => m.GuiaPrimerVapeModule),
  },
  {
    path: 'guias/sales-vs-base-libre',
    loadChildren: () =>
      import('./guia-sales-vs-freebase/guia-sales-vs-freebase.module').then(m => m.GuiaSalesVsFreebaseModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
