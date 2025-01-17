import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureLabResultsApprovalComponent } from './capture-lab-results-approval.component';

describe('CaptureLabResultsApprovalComponent', () => {
  let component: CaptureLabResultsApprovalComponent;
  let fixture: ComponentFixture<CaptureLabResultsApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptureLabResultsApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureLabResultsApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
