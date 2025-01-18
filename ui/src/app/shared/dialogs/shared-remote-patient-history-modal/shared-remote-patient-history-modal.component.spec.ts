import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRemotePatientHistoryModalComponent } from './shared-remote-patient-history-modal.component';

describe('SharedRemotePatientHistoryModalComponent', () => {
  let component: SharedRemotePatientHistoryModalComponent;
  let fixture: ComponentFixture<SharedRemotePatientHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedRemotePatientHistoryModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedRemotePatientHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
