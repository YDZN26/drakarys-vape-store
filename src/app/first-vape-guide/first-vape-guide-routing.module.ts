import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstVapeGuidePage } from './first-vape-guide.page';
import { ageGuard } from '../core/age-gate/age.guard';

const routes: Routes = [
  {
    path: '',
    component: FirstVapeGuidePage,
    canActivate: [ageGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FirstVapeGuideRoutingModule {}
