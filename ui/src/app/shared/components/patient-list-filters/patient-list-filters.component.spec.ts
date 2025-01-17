import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientListFiltersComponent } from './patient-list-filters.component';

describe('PatientListFiltersComponent', () => {
  let component: PatientListFiltersComponent;
  let fixture: ComponentFixture<PatientListFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientListFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientListFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
