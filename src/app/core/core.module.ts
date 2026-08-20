import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { AgeVerificationModalComponent } from './age-gate/age-verification-modal/age-verification-modal.component';
import { StoreClosedBannerComponent } from './store-hours/store-closed-banner/store-closed-banner.component';
import { ProductCardComponent } from '../catalog/components/product-card/product-card.component';
import { CategoryNamePipe } from './pipes/category-name.pipe';

@NgModule({
  declarations: [AgeVerificationModalComponent, StoreClosedBannerComponent, ProductCardComponent, CategoryNamePipe],
  imports: [CommonModule, IonicModule, TranslateModule],
  exports: [StoreClosedBannerComponent, ProductCardComponent, CategoryNamePipe, TranslateModule],
})
export class CoreModule {}
