import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDiagnosisModalComponent } from './delete-diagnosis-modal.component';

describe('DeleteDiagnosisModalComponent', () => {
  let component: DeleteDiagnosisModalComponent;
  let fixture: ComponentFixture<DeleteDiagnosisModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDiagnosisModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDiagnosisModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
