import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuiaPrimerVapePage } from './guia-primer-vape.page';
import { ageGuard } from '../core/age-gate/age.guard';

const routes: Routes = [
  {
    path: '',
    component: GuiaPrimerVapePage,
    canActivate: [ageGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuiaPrimerVapeRoutingModule {}
