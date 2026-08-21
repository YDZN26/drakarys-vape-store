import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CartRoutingModule } from './cart-routing.module';
import { CoreModule } from '../core/core.module';
import { CartPage } from './cart.page';

@NgModule({
  declarations: [CartPage],
  imports: [CommonModule, IonicModule, CartRoutingModule, CoreModule],
})
export class CartModule {}
