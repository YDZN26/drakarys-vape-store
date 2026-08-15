import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { GuiaSalesVsFreebaseRoutingModule } from './guia-sales-vs-freebase-routing.module';
import { GuiaSalesVsFreebasePage } from './guia-sales-vs-freebase.page';

@NgModule({
  declarations: [GuiaSalesVsFreebasePage],
  imports: [CommonModule, IonicModule, GuiaSalesVsFreebaseRoutingModule],
})
export class GuiaSalesVsFreebaseModule {}
