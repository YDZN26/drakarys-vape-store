import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AgeVerificationService } from '../age-verification.service';
import { WindowRef } from '../../window/window-ref.service';

@Component({
  selector: 'app-age-verification-modal',
  templateUrl: './age-verification-modal.component.html',
  styleUrls: ['./age-verification-modal.component.scss'],
  standalone: false,
})
export class AgeVerificationModalComponent {
  constructor(
    private modalCtrl: ModalController,
    private ageService: AgeVerificationService,
    private windowRef: WindowRef
  ) {}

  confirm(): void {
    this.ageService.confirmAge();
    this.modalCtrl.dismiss({ confirmed: true });
  }

  decline(): void {
    this.ageService.declineAge();
    this.windowRef.nativeWindow.location.href = 'https://www.google.com';
  }
}
