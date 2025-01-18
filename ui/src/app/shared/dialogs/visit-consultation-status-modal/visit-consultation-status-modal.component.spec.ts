import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitConsultationStatusModalComponent } from './visit-consultation-status-modal.component';

describe('VisitConsultationStatusModalComponent', () => {
  let component: VisitConsultationStatusModalComponent;
  let fixture: ComponentFixture<VisitConsultationStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitConsultationStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitConsultationStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
