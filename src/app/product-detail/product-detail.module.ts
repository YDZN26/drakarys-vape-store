import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { ProductDetailRoutingModule } from './product-detail-routing.module';
import { ProductDetailPage } from './product-detail.page';

@NgModule({
  declarations: [ProductDetailPage],
  imports: [CommonModule, IonicModule, ProductDetailRoutingModule, TranslateModule],
})
export class ProductDetailModule {}
