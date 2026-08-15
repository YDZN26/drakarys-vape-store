import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuiaSalesVsFreebasePage } from './guia-sales-vs-freebase.page';
import { ageGuard } from '../core/age-gate/age.guard';

const routes: Routes = [
  {
    path: '',
    component: GuiaSalesVsFreebasePage,
    canActivate: [ageGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuiaSalesVsFreebaseRoutingModule {}
