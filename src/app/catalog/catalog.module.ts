import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CoreModule } from '../core/core.module';
import { CatalogPage } from './catalog.page';
import { CatalogStateService } from './services/catalog-state.service';

import { CategoryListComponent } from './components/category-list/category-list.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { ActiveFilterChipsComponent } from './components/active-filter-chips/active-filter-chips.component';
import { SortSelectorComponent } from './components/sort-selector/sort-selector.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';

@NgModule({
  declarations: [
    CatalogPage,
    CategoryListComponent,
    SearchBarComponent,
    FilterPanelComponent,
    ActiveFilterChipsComponent,
    SortSelectorComponent,
    ProductGridComponent,
    EmptyStateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CatalogRoutingModule,
    CoreModule,
  ],
  providers: [CatalogStateService],
})
export class CatalogModule {}
