import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsByVisitsListComponent } from './patients-by-visits-list.component';

describe('PatientsByVisitsListComponent', () => {
  let component: PatientsByVisitsListComponent;
  let fixture: ComponentFixture<PatientsByVisitsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientsByVisitsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsByVisitsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
