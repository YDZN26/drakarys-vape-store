import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CATEGORY_TRANSLATIONS } from '../constants/category-translations';

const LANG_STORAGE_KEY = 'drakarys_lang';
type SupportedLang = 'es' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');
  }

  init(): void {
    const storedLang = localStorage.getItem(LANG_STORAGE_KEY) as SupportedLang | null;
    if (storedLang === 'es' || storedLang === 'en') {
      this.translate.use(storedLang);
      return;
    }
    this.detectAndSetLanguage();
  }

  detectAndSetLanguage(): void {
    const browserLang = navigator.language || navigator.languages?.[0] || '';
    const lang: SupportedLang = browserLang.toLowerCase().startsWith('en') ? 'en' : 'es';
    this.translate.use(lang);
  }

  setLanguage(lang: SupportedLang): void {
    this.translate.use(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }

  getCategoryDisplayName(categoryId: number, categoryName: string): string {
    const translation = CATEGORY_TRANSLATIONS[categoryId];
    if (!translation) {
      return categoryName;
    }
    return this.translate.currentLang === 'en' ? translation.en : translation.es;
  }
}
