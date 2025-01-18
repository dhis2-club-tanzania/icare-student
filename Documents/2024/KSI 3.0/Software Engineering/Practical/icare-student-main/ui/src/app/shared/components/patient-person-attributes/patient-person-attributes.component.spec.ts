import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPersonAttributesComponent } from './patient-person-attributes.component';

describe('PatientPersonAttributesComponent', () => {
  let component: PatientPersonAttributesComponent;
  let fixture: ComponentFixture<PatientPersonAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientPersonAttributesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientPersonAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
