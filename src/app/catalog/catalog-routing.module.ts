import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogPage } from './catalog.page';
import { ageGuard } from '../core/age-gate/age.guard';

const routes: Routes = [
  {
    path: '',
    component: CatalogPage,
    canActivate: [ageGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
