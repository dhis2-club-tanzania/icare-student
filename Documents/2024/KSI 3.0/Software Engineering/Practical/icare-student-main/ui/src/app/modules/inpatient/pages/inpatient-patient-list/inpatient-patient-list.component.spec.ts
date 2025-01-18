import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InpatientPatientListComponent } from './inpatient-patient-list.component';

describe('InpatientPatientListComponent', () => {
  let component: InpatientPatientListComponent;
  let fixture: ComponentFixture<InpatientPatientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InpatientPatientListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InpatientPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
