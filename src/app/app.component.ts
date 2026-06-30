import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { AgeVerificationService } from './core/age-gate/age-verification.service';
import { AgeVerificationModalComponent } from './core/age-gate/age-verification-modal/age-verification-modal.component';

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
    private ageService: AgeVerificationService
  ) {}

  async ngOnInit(): Promise<void> {
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
