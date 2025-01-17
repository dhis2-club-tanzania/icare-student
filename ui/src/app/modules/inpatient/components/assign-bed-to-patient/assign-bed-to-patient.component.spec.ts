import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignBedToPatientComponent } from './assign-bed-to-patient.component';

describe('AssignBedToPatientComponent', () => {
  let component: AssignBedToPatientComponent;
  let fixture: ComponentFixture<AssignBedToPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignBedToPatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignBedToPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
