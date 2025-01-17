import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferPatientOutsideComponent } from './transfer-patient-outside.component';

describe('TransferPatientOutsideComponent', () => {
  let component: TransferPatientOutsideComponent;
  let fixture: ComponentFixture<TransferPatientOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferPatientOutsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferPatientOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
