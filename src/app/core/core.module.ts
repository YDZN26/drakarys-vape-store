import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AgeVerificationModalComponent } from './age-gate/age-verification-modal/age-verification-modal.component';
import { StoreClosedBannerComponent } from './store-hours/store-closed-banner/store-closed-banner.component';
import { ProductCardComponent } from '../catalog/components/product-card/product-card.component';

@NgModule({
  declarations: [AgeVerificationModalComponent, StoreClosedBannerComponent, ProductCardComponent],
  imports: [CommonModule, IonicModule],
  exports: [StoreClosedBannerComponent, ProductCardComponent],
})
export class CoreModule {}
