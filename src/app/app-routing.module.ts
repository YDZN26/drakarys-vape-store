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
    redirectTo: 'guides/first-vape',
    pathMatch: 'full',
  },
  {
    path: 'guias/sales-vs-base-libre',
    redirectTo: 'guides/salt-vs-freebase',
    pathMatch: 'full',
  },
  {
    path: 'guides/first-vape',
    loadChildren: () =>
      import('./first-vape-guide/first-vape-guide.module').then(m => m.FirstVapeGuideModule),
  },
  {
    path: 'guides/salt-vs-freebase',
    loadChildren: () =>
      import('./salt-vs-freebase-guide/salt-vs-freebase-guide.module').then(m => m.SaltVsFreebaseGuideModule),
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
