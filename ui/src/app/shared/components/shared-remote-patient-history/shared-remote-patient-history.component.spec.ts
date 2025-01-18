import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRemotePatientHistoryComponent } from './shared-remote-patient-history.component';

describe('SharedRemotePatientHistoryComponent', () => {
  let component: SharedRemotePatientHistoryComponent;
  let fixture: ComponentFixture<SharedRemotePatientHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedRemotePatientHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedRemotePatientHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
