import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiagnosisModalComponent } from './add-diagnosis-modal.component';

describe('AddDiagnosisModalComponent', () => {
  let component: AddDiagnosisModalComponent;
  let fixture: ComponentFixture<AddDiagnosisModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDiagnosisModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiagnosisModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
