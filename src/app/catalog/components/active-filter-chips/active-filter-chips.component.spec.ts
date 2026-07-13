import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActiveFilterChipsComponent } from './active-filter-chips.component';
import { ProductFilters } from '../../../core/models/product-filters.model';

describe('ActiveFilterChipsComponent', () => {
  let component: ActiveFilterChipsComponent;
  let fixture: ComponentFixture<ActiveFilterChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActiveFilterChipsComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveFilterChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('hasFilters is false when filters are empty', () => {
    component.filters = {};
    expect(component.hasFilters).toBeFalse();
  });

  it('hasFilters is true when a filter is set', () => {
    component.filters = { categoryId: 1 };
    expect(component.hasFilters).toBeTrue();
  });

  it('builds a chip for categoryId', () => {
    component.filters = { categoryId: 1 };
    expect(component.activeFilters.find(f => f.key === 'categoryId')).toBeTruthy();
  });

  it('builds a chip for searchTerm with quoted label', () => {
    component.filters = { searchTerm: 'mango' };
    const chip = component.activeFilters.find(f => f.key === 'searchTerm');
    expect(chip?.label).toBe('"mango"');
  });

  it('builds a single price chip for minPrice + maxPrice', () => {
    component.filters = { minPrice: 10, maxPrice: 50 };
    const priceChips = component.activeFilters.filter(
      f => f.key === 'minPrice' || f.key === 'maxPrice'
    );
    expect(priceChips.length).toBe(1);
  });

  it('emits removeFilter when remove() is called', () => {
    spyOn(component.removeFilter, 'emit');
    component.remove('productType');
    expect(component.removeFilter.emit).toHaveBeenCalledWith('productType');
  });

  it('emits both minPrice and maxPrice when removing price range', () => {
    spyOn(component.removeFilter, 'emit');
    component.remove('minPrice');
    expect(component.removeFilter.emit).toHaveBeenCalledWith('minPrice');
    expect(component.removeFilter.emit).toHaveBeenCalledWith('maxPrice');
  });

  it('emits clearAll when clear() is called', () => {
    spyOn(component.clearAll, 'emit');
    component.clear();
    expect(component.clearAll.emit).toHaveBeenCalled();
  });
});
