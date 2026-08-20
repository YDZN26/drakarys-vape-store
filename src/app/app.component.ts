import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { AgeVerificationService } from './core/age-gate/age-verification.service';
import { AgeVerificationModalComponent } from './core/age-gate/age-verification-modal/age-verification-modal.component';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private ageService: AgeVerificationService,
    private languageService: LanguageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.languageService.init();
    await this.platform.ready();
    if (!this.ageService.isVerified()) {
      const modal = await this.modalCtrl.create({
        component: AgeVerificationModalComponent,
        backdropDismiss: false,
        cssClass: 'age-gate-modal',
      });
      await modal.present();
    }
  }
}
