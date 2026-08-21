import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaltVsFreebaseGuidePage } from './salt-vs-freebase-guide.page';
import { ageGuard } from '../core/age-gate/age.guard';

const routes: Routes = [
  {
    path: '',
    component: SaltVsFreebaseGuidePage,
    canActivate: [ageGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaltVsFreebaseGuideRoutingModule {}
