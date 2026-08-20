import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'categoryName',
  standalone: false,
  pure: false,
})
export class CategoryNamePipe implements PipeTransform {
  constructor(private readonly languageService: LanguageService) {}

  transform(categoryName: string, categoryId: number): string {
    return this.languageService.getCategoryDisplayName(categoryId, categoryName);
  }
}
