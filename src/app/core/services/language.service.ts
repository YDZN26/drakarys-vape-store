import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CATEGORY_TRANSLATIONS } from '../constants/category-translations';

const LANG_STORAGE_KEY = 'drakarys_lang';
export type SupportedLang = 'es' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly currentLangSubject = new BehaviorSubject<SupportedLang>('es');
  readonly currentLang$: Observable<SupportedLang> = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');
  }

  init(): void {
    const storedLang = localStorage.getItem(LANG_STORAGE_KEY) as SupportedLang | null;
    if (storedLang === 'es' || storedLang === 'en') {
      this.applyLanguage(storedLang);
      return;
    }
    this.detectAndSetLanguage();
  }

  detectAndSetLanguage(): void {
    const browserLang = navigator.language || navigator.languages?.[0] || '';
    const lang: SupportedLang = browserLang.toLowerCase().startsWith('en') ? 'en' : 'es';
    this.applyLanguage(lang);
  }

  setLanguage(lang: SupportedLang): void {
    this.applyLanguage(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }

  getCategoryDisplayName(categoryId: number, categoryName: string): string {
    const translation = CATEGORY_TRANSLATIONS[categoryId];
    if (!translation) {
      return categoryName;
    }
    return this.currentLangSubject.value === 'en' ? translation.en : translation.es;
  }

  private applyLanguage(lang: SupportedLang): void {
    this.translate.use(lang);
    this.currentLangSubject.next(lang);
    document.documentElement.lang = lang;
  }
}
