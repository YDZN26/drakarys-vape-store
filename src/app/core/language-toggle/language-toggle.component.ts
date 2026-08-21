import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LanguageService, SupportedLang } from '../services/language.service';

@Component({
  selector: 'app-language-toggle',
  templateUrl: './language-toggle.component.html',
  styleUrls: ['./language-toggle.component.scss'],
  standalone: false,
})
export class LanguageToggleComponent {
  readonly activeLang$: Observable<SupportedLang> = this.languageService.currentLang$;

  constructor(private readonly languageService: LanguageService) {}

  setLanguage(lang: SupportedLang): void {
    this.languageService.setLanguage(lang);
  }
}
