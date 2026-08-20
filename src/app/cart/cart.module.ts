import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { CartRoutingModule } from './cart-routing.module';
import { CartPage } from './cart.page';

@NgModule({
  declarations: [CartPage],
  imports: [CommonModule, IonicModule, CartRoutingModule, TranslateModule],
})
export class CartModule {}
