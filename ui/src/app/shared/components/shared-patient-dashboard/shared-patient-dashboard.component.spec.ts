import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPatientDashboardComponent } from './shared-patient-dashboard.component';

describe('SharedPatientDashboardComponent', () => {
  let component: SharedPatientDashboardComponent;
  let fixture: ComponentFixture<SharedPatientDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedPatientDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPatientDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
