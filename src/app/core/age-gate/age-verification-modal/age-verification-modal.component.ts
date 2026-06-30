import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AgeVerificationService } from '../age-verification.service';

@Component({
  selector: 'app-age-verification-modal',
  templateUrl: './age-verification-modal.component.html',
  styleUrls: ['./age-verification-modal.component.scss'],
  standalone: false,
})
export class AgeVerificationModalComponent {
  constructor(
    private modalCtrl: ModalController,
    private ageService: AgeVerificationService
  ) {}

  confirm(): void {
    this.ageService.confirmAge();
    this.modalCtrl.dismiss({ confirmed: true });
  }

  decline(): void {
    this.ageService.declineAge();
    window.location.href = 'https://www.google.com';
  }
}
