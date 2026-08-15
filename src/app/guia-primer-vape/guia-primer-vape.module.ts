import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { GuiaPrimerVapeRoutingModule } from './guia-primer-vape-routing.module';
import { GuiaPrimerVapePage } from './guia-primer-vape.page';

@NgModule({
  declarations: [GuiaPrimerVapePage],
  imports: [CommonModule, IonicModule, GuiaPrimerVapeRoutingModule],
})
export class GuiaPrimerVapeModule {}
