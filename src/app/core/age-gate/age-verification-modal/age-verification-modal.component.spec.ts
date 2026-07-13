import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { AgeVerificationModalComponent } from './age-verification-modal.component';
import { AgeVerificationService } from '../age-verification.service';
import { WindowRef } from '../../window/window-ref.service';

describe('AgeVerificationModalComponent', () => {
  let component: AgeVerificationModalComponent;
  let fixture: ComponentFixture<AgeVerificationModalComponent>;
  let ageServiceSpy: jasmine.SpyObj<AgeVerificationService>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;
  let windowRefStub: { nativeWindow: { location: { href: string } } };

  beforeEach(async () => {
    ageServiceSpy = jasmine.createSpyObj('AgeVerificationService', ['confirmAge', 'declineAge']);
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    modalCtrlSpy.dismiss.and.returnValue(Promise.resolve(true));
    // Plain mock object standing in for WindowRef -- real Chrome makes
    // window.location non-configurable, so it cannot be redefined or
    // spied on directly (Object.defineProperty/spyOnProperty both throw
    // here even with configurable: true). The component gets its window
    // access through the injectable WindowRef instead, so tests just
    // swap that for a fake with a freely mutable location.href.
    windowRefStub = { nativeWindow: { location: { href: '' } } };

    await TestBed.configureTestingModule({
      declarations: [AgeVerificationModalComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AgeVerificationService, useValue: ageServiceSpy },
        { provide: ModalController, useValue: modalCtrlSpy },
        { provide: WindowRef, useValue: windowRefStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgeVerificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('confirm() calls ageService.confirmAge() and dismisses modal', async () => {
    await component.confirm();
    expect(ageServiceSpy.confirmAge).toHaveBeenCalled();
    expect(modalCtrlSpy.dismiss).toHaveBeenCalledWith({ confirmed: true });
  });

  it('decline() calls ageService.declineAge() and redirects to google.com', () => {
    component.decline();
    expect(ageServiceSpy.declineAge).toHaveBeenCalled();
    expect(windowRefStub.nativeWindow.location.href).toBe('https://www.google.com');
  });

  it('does NOT dismiss the modal on decline', () => {
    component.decline();
    expect(modalCtrlSpy.dismiss).not.toHaveBeenCalled();
  });
});
