import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { AgeVerificationModalComponent } from './age-gate/age-verification-modal/age-verification-modal.component';
import { StoreClosedBannerComponent } from './store-hours/store-closed-banner/store-closed-banner.component';
import { ProductCardComponent } from '../catalog/components/product-card/product-card.component';
import { CategoryNamePipe } from './pipes/category-name.pipe';
import { LanguageToggleComponent } from './language-toggle/language-toggle.component';

@NgModule({
  declarations: [
    AgeVerificationModalComponent,
    StoreClosedBannerComponent,
    ProductCardComponent,
    CategoryNamePipe,
    LanguageToggleComponent,
  ],
  imports: [CommonModule, IonicModule, TranslateModule],
  exports: [
    StoreClosedBannerComponent,
    ProductCardComponent,
    CategoryNamePipe,
    LanguageToggleComponent,
    TranslateModule,
  ],
})
export class CoreModule {}
