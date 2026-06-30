import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { EmptyStateComponent } from './empty-state.component';
import { Category } from '../../../core/models/category.model';

const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Disposables', slug: 'disposables', imageUrl: '' },
];

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmptyStateComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('emits clearFilters when onClearFilters is called', () => {
    spyOn(component.clearFilters, 'emit');
    component.onClearFilters();
    expect(component.clearFilters.emit).toHaveBeenCalled();
  });

  it('emits categorySelect with the category id', () => {
    spyOn(component.categorySelect, 'emit');
    component.onCategorySelect('c1');
    expect(component.categorySelect.emit).toHaveBeenCalledWith('c1');
  });

  it('renders category chips when categories are provided', () => {
    component.categories = MOCK_CATEGORIES;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('ion-chip').length).toBeGreaterThan(0);
  });
});
