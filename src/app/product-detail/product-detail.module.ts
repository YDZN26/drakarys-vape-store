import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ProductDetailRoutingModule } from './product-detail-routing.module';
import { ProductDetailPage } from './product-detail.page';

@NgModule({
  declarations: [ProductDetailPage],
  imports: [CommonModule, IonicModule, ProductDetailRoutingModule],
})
export class ProductDetailModule {}
