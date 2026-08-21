import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FirstVapeGuideRoutingModule } from './first-vape-guide-routing.module';
import { CoreModule } from '../core/core.module';
import { FirstVapeGuidePage } from './first-vape-guide.page';

@NgModule({
  declarations: [FirstVapeGuidePage],
  imports: [CommonModule, IonicModule, FirstVapeGuideRoutingModule, CoreModule],
})
export class FirstVapeGuideModule {}
