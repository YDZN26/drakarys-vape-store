import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CategoryService } from './category.service';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { Category } from '../../core/models/category.model';

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Disposables', slug: 'disposables', imageUrl: '' },
  { id: '2', name: 'Pods', slug: 'pods', imageUrl: '' },
];

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    const mockClient = {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: MOCK_CATEGORIES, error: null }),
        }),
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        { provide: SupabaseService, useValue: { client: mockClient } },
      ],
    });

    service = TestBed.inject(CategoryService);
  });

  it('returns categories from Supabase', async () => {
    const categories = await firstValueFrom(service.getCategories());
    expect(categories).toEqual(MOCK_CATEGORIES);
  });

  it('returns empty array when no categories exist', async () => {
    const mockClient = {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    };
    const emptyService = new CategoryService({ client: mockClient } as any);
    const categories = await firstValueFrom(emptyService.getCategories());
    expect(categories).toEqual([]);
  });
});
