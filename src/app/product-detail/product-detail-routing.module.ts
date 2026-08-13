import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailPage } from './product-detail.page';
import { ageGuard } from '../core/age-gate/age.guard';

const routes: Routes = [
  {
    path: '',
    component: ProductDetailPage,
    canActivate: [ageGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductDetailRoutingModule {}
