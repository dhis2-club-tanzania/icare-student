import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLabReportFormDataDisplayComponent } from './shared-lab-report-form-data-display.component';

describe('SharedLabReportFormDataDisplayComponent', () => {
  let component: SharedLabReportFormDataDisplayComponent;
  let fixture: ComponentFixture<SharedLabReportFormDataDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedLabReportFormDataDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLabReportFormDataDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
