import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { AgeVerificationModalComponent } from './age-verification-modal.component';
import { AgeVerificationService } from '../age-verification.service';

describe('AgeVerificationModalComponent', () => {
  let component: AgeVerificationModalComponent;
  let fixture: ComponentFixture<AgeVerificationModalComponent>;
  let ageServiceSpy: jasmine.SpyObj<AgeVerificationService>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    ageServiceSpy = jasmine.createSpyObj('AgeVerificationService', ['confirmAge', 'declineAge']);
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    modalCtrlSpy.dismiss.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      declarations: [AgeVerificationModalComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AgeVerificationService, useValue: ageServiceSpy },
        { provide: ModalController, useValue: modalCtrlSpy },
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
    spyOnProperty(window, 'location').and.returnValue({ href: '' } as Location);
    component.decline();
    expect(ageServiceSpy.declineAge).toHaveBeenCalled();
    expect(window.location.href).toBe('https://www.google.com');
  });

  it('does NOT dismiss the modal on decline', () => {
    spyOnProperty(window, 'location').and.returnValue({ href: '' } as Location);
    component.decline();
    expect(modalCtrlSpy.dismiss).not.toHaveBeenCalled();
  });
});
