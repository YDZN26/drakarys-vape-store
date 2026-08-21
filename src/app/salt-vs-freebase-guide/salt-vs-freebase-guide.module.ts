import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SaltVsFreebaseGuideRoutingModule } from './salt-vs-freebase-guide-routing.module';
import { CoreModule } from '../core/core.module';
import { SaltVsFreebaseGuidePage } from './salt-vs-freebase-guide.page';

@NgModule({
  declarations: [SaltVsFreebaseGuidePage],
  imports: [CommonModule, IonicModule, SaltVsFreebaseGuideRoutingModule, CoreModule],
})
export class SaltVsFreebaseGuideModule {}
