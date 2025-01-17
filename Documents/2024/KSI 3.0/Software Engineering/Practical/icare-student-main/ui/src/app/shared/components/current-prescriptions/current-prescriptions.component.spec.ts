import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPrescriptionComponent } from './current-prescriptions.component';

describe('CurrentPrescriptionComponent', () => {
  let component: CurrentPrescriptionComponent;
  let fixture: ComponentFixture<CurrentPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentPrescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
